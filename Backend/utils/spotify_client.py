import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
from config import Config

class SpotifyClient:
    def __init__(self, use_oauth=False):
        if use_oauth:
            self.sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
                client_id=Config.SPOTIFY_CLIENT_ID,
                client_secret=Config.SPOTIFY_CLIENT_SECRET,
                redirect_uri=Config.SPOTIFY_REDIRECT_URI,
                scope="user-library-read user-top-read playlist-modify-public"
            ))
        else:
            self.sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
                client_id=Config.SPOTIFY_CLIENT_ID,
                client_secret=Config.SPOTIFY_CLIENT_SECRET
            ))
    
    def get_audio_features(self, track_id):
        """Get audio features for a track"""
        try:
            features = self.sp.audio_features([track_id])[0]
            return features
        except Exception as e:
            print(f"Error fetching audio features: {e}")
            return None
    
    def search_track(self, query):
        """Search for a track"""
        try:
            results = self.sp.search(q=query, type='track', limit=1)
            if results['tracks']['items']:
                return results['tracks']['items'][0]
            return None
        except Exception as e:
            print(f"Error searching track: {e}")
            return None
    
    def get_seed_tracks_by_mood(self, mood):
        """Get seed tracks based on mood using genre search"""
        mood_to_genre = {
            'Happy': 'pop',
            'Sad': 'sad',
            'Energetic': 'dance',
            'Calm': 'chill'
        }
        
        genre = mood_to_genre.get(mood, 'pop')
        
        try:
            # Search for popular tracks in the genre
            results = self.sp.search(q=f'genre:{genre}', type='track', limit=5)
            track_ids = [track['id'] for track in results['tracks']['items']]
            return track_ids[:5]  # Spotify allows max 5 seeds
        except Exception as e:
            print(f"Error getting seed tracks: {e}")
            # Fallback to popular tracks
            return self.get_popular_seed_tracks()
    
    def get_popular_seed_tracks(self):
        """Get popular tracks as fallback seeds"""
        try:
            # Search for popular tracks
            results = self.sp.search(q='year:2023-2024', type='track', limit=5)
            track_ids = [track['id'] for track in results['tracks']['items']]
            return track_ids[:5]
        except Exception as e:
            print(f"Error getting popular seeds: {e}")
            # Hard-coded fallback seeds (popular tracks that usually exist)
            return [
                '3n3Ppam7vgaVa1iaRUc9Lp',  # Mr. Brightside - The Killers
                '0VjIjW4GlUZAMYd2vXMi3b',  # Blinding Lights - The Weeknd
                '6habFhsOp2NvshLv26DqMb',  # Super Bass - Nicki Minaj
            ]
    
    def get_recommendations(self, seed_tracks=None, target_valence=None, 
                          target_energy=None, target_tempo=None, limit=20, mood=None):
        """Get track recommendations based on audio features"""
        try:
            # If no seed tracks provided, get them based on mood
            if not seed_tracks or len(seed_tracks) == 0:
                if mood:
                    seed_tracks = self.get_seed_tracks_by_mood(mood)
                else:
                    seed_tracks = self.get_popular_seed_tracks()
            
            # Ensure we have valid seeds
            if not seed_tracks:
                seed_tracks = self.get_popular_seed_tracks()
            
            # Spotify API requires at least one seed
            seed_tracks = seed_tracks[:5]  # Max 5 seeds allowed
            
            print(f"Using seed tracks: {seed_tracks}")
            print(f"Target values - Valence: {target_valence}, Energy: {target_energy}, Tempo: {target_tempo}")
            
            # Get recommendations with seeds AND target values
            recommendations = self.sp.recommendations(
                seed_tracks=seed_tracks,
                target_valence=target_valence,
                target_energy=target_energy,
                target_tempo=target_tempo,
                limit=limit
            )
            
            return recommendations['tracks']
        except Exception as e:
            print(f"Error getting recommendations: {e}")
            # Try without target values as fallback
            try:
                recommendations = self.sp.recommendations(
                    seed_tracks=seed_tracks[:5],
                    limit=limit
                )
                return recommendations['tracks']
            except Exception as e2:
                print(f"Fallback also failed: {e2}")
                return []
