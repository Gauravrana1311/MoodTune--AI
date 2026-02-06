from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from config import Config
from utils.spotify_client import SpotifyClient
from utils.audio_processor import AudioProcessor
from models.mood_classifier import MoodClassifier

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

spotify_client = SpotifyClient(use_oauth=False)
audio_processor = AudioProcessor()
mood_classifier = MoodClassifier()

os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'API is running'})

@app.route('/api/analyze', methods=['POST'])
def analyze_audio():
    """Analyze uploaded audio file for mood detection"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        print(f"Analyzing file: {filename}")
        
        features = audio_processor.extract_features(filepath)
        
        if features is None:
            return jsonify({'error': 'Failed to extract audio features'}), 500
        
        valence, energy = audio_processor.estimate_valence_energy(features)
        mood, confidence = mood_classifier.classify_mood_simple(valence, energy)
        
        print(f"Detected mood: {mood} (confidence: {confidence})")
        
        response = {
            'mood': mood,
            'confidence': confidence,
            'audio_features': {
                'valence': valence,
                'energy': energy,
                'tempo': features['tempo'],
                'spectral_centroid': features['spectral_centroid']
            },
            'filename': filename
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Error in analyze_audio: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    """Get highly accurate mood-matched recommendations"""
    try:
        data = request.get_json()
        mood = data.get('mood', 'Calm')
        
        print(f"\n{'='*50}")
        print(f"Getting STRICT {mood} recommendations")
        print(f"{'='*50}")
        
        targets = mood_classifier.get_mood_recommendations(mood)
        
        # Stricter criteria - both conditions must match
        mood_criteria = {
            'Happy': {
                'valence_min': 0.50,
                'energy_min': 0.50,
                'check': lambda v, e: v >= 0.50 and e >= 0.50
            },
            'Sad': {
                'valence_max': 0.50,
                'energy_max': 0.50,
                'check': lambda v, e: v <= 0.50 and e <= 0.50
            },
            'Energetic': {
                'energy_min': 0.65,
                'check': lambda v, e: e >= 0.65
            },
            'Calm': {
                'energy_max': 0.60,
                'valence_min': 0.30,
                'valence_max': 0.70,
                'check': lambda v, e: e <= 0.60 and 0.30 <= v <= 0.70
            }
        }
        
        criteria = mood_criteria.get(mood)
        
        # Better search queries
        search_queries = {
            'Happy': [
                'bollywood happy cheerful songs',
                'upbeat hindi party music',
                'feel good bollywood dance',
                'positive energy hindi songs'
            ],
            'Sad': [
                'sad bollywood heartbreak songs',
                'emotional slow hindi songs',
                'arijit singh sad songs',
                'melancholic romantic hindi'
            ],
            'Energetic': [
                'high energy bollywood dance',
                'workout hindi gym songs',
                'fast tempo party bollywood',
                'energetic dance hindi music'
            ],
            'Calm': [
                'peaceful bollywood romantic',
                'soft acoustic hindi songs',
                'soothing relaxing bollywood',
                'calm unplugged hindi music'
            ]
        }
        
        queries = search_queries.get(mood, ['bollywood'])
        
        # Collect MANY candidates (we'll filter strictly)
        all_candidates = []
        
        for query in queries:
            try:
                print(f"Searching: {query}")
                result = spotify_client.sp.search(q=query, type='track', limit=20, market='IN')
                all_candidates.extend(result['tracks']['items'])
                print(f"  Found {len(result['tracks']['items'])} songs")
            except Exception as e:
                print(f"  Search error: {e}")
                continue
        
        print(f"\nTotal candidates: {len(all_candidates)}")
        
        # Strictly filter using audio features
        verified_tracks = []
        checked = 0
        rejected = 0
        
        for track in all_candidates:
            if len(verified_tracks) >= 20:
                break
            
            # Skip duplicates
            if any(t['id'] == track['id'] for t in verified_tracks):
                continue
            
            checked += 1
            
            try:
                # Get audio features
                features = spotify_client.sp.audio_features([track['id']])[0]
                
                if not features:
                    rejected += 1
                    continue
                
                valence = features['valence']
                energy = features['energy']
                tempo = features['tempo']
                
                # Apply STRICT mood check
                passes = criteria['check'](valence, energy)
                
                if passes:
                    verified_tracks.append(track)
                    print(f"✓ {track['name'][:35]:35} | V:{valence:.2f} E:{energy:.2f} T:{tempo:.0f}")
                else:
                    rejected += 1
                    print(f"✗ {track['name'][:35]:35} | V:{valence:.2f} E:{energy:.2f} - Rejected")
                    
            except Exception as e:
                rejected += 1
                continue
        
        print(f"\nChecked: {checked}, Passed: {len(verified_tracks)}, Rejected: {rejected}")
        
        # If we have enough verified tracks, use them
        if len(verified_tracks) >= 15:
            tracks = verified_tracks[:20]
            print(f"✅ Using {len(tracks)} strictly verified songs")
        else:
            # Not enough strict matches, use Spotify Recommendations API with strict filters
            print(f"Only {len(verified_tracks)} strict matches, using Spotify Recommendations API...")
            
            try:
                # Get seed from verified tracks or search
                if verified_tracks:
                    seed_ids = [t['id'] for t in verified_tracks[:5]]
                else:
                    search_result = spotify_client.sp.search(q=queries[0], type='track', limit=5, market='IN')
                    seed_ids = [t['id'] for t in search_result['tracks']['items']][:5]
                
                # Use Spotify recommendations with MIN/MAX constraints
                rec_params = {
                    'seed_tracks': seed_ids,
                    'target_valence': targets['valence'],
                    'target_energy': targets['energy'],
                    'target_tempo': targets['tempo'],
                    'limit': 20
                }
                
                # Add strict min/max based on mood
                if mood == 'Happy':
                    rec_params['min_valence'] = 0.50
                    rec_params['min_energy'] = 0.50
                elif mood == 'Sad':
                    rec_params['max_valence'] = 0.50
                    rec_params['max_energy'] = 0.50
                elif mood == 'Energetic':
                    rec_params['min_energy'] = 0.65
                elif mood == 'Calm':
                    rec_params['max_energy'] = 0.60
                    rec_params['min_valence'] = 0.30
                    rec_params['max_valence'] = 0.70
                
                recommendations = spotify_client.sp.recommendations(**rec_params)
                api_tracks = recommendations['tracks']
                
                # Combine verified + API tracks
                all_final = verified_tracks + api_tracks
                
                # Remove duplicates
                seen = set()
                unique = []
                for track in all_final:
                    if track['id'] not in seen:
                        seen.add(track['id'])
                        unique.append(track)
                
                tracks = unique[:20]
                print(f"✅ Combined: {len(tracks)} songs")
                
            except Exception as e:
                print(f"Recommendations API error: {e}")
                # Last resort: use what we have
                tracks = verified_tracks[:20] if verified_tracks else all_candidates[:20]
        
        if not tracks:
            return jsonify({'error': 'No songs found matching criteria'}), 404
        
        # Format response
        recommendations_list = []
        for i, track in enumerate(tracks, 1):
            recommendations_list.append({
                'id': track['id'],
                'name': track['name'],
                'artist': ', '.join([artist['name'] for artist in track['artists']]),
                'album': track['album']['name'],
                'preview_url': track['preview_url'],
                'spotify_url': track['external_urls']['spotify'],
                'image': track['album']['images'][0]['url'] if track['album']['images'] else None
            })
        
        print(f"\n✅ FINAL: Returning {len(recommendations_list)} {mood} recommendations")
        print(f"{'='*50}\n")
        
        return jsonify({
            'mood': mood,
            'recommendations': recommendations_list
        }), 200
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/remix', methods=['POST'])
def create_remix():
    """Create remix based on detected mood"""
    try:
        data = request.get_json()
        filename = data.get('filename')
        mood = data.get('mood', 'Calm')
        
        if not filename:
            return jsonify({'error': 'Filename required'}), 400
        
        print(f"Creating remix for {filename} with mood: {mood}")
        
        input_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        output_filename = f"remix_{filename}"
        output_path = os.path.join(Config.UPLOAD_FOLDER, output_filename)
        
        if not os.path.exists(input_path):
            return jsonify({'error': 'Original file not found'}), 404
        
        success = audio_processor.create_remix(input_path, output_path, mood)
        
        if not success:
            return jsonify({'error': 'Failed to create remix'}), 500
        
        print(f"Remix created successfully: {output_filename}")
        
        return jsonify({
            'message': 'Remix created successfully',
            'remix_filename': output_filename
        }), 200
        
    except Exception as e:
        print(f"Error in create_remix: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download remixed audio file"""
    try:
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
        
        return send_file(filepath, as_attachment=True)
    except Exception as e:
        print(f"Error in download_file: {e}")
        return jsonify({'error': str(e)}), 404

if __name__ == '__main__':
    print("Starting Mood Music Analyzer Backend...")
    print("Backend running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000, host='127.0.0.1')
