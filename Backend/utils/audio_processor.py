import librosa
import numpy as np
from pydub import AudioSegment
import soundfile as sf
from config import Config

class AudioProcessor:
    
    @staticmethod
    def extract_features(file_path):
        try:
            y, sr = librosa.load(file_path, sr=Config.SAMPLE_RATE, duration=30)
            
            features = {}
            
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            features['tempo'] = float(tempo)
            
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            features['spectral_centroid'] = float(np.mean(spectral_centroids))
            
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=Config.N_MFCC)
            features['mfcc_mean'] = float(np.mean(mfccs))
            features['mfcc_std'] = float(np.std(mfccs))
            
            zcr = librosa.feature.zero_crossing_rate(y)[0]
            features['zcr'] = float(np.mean(zcr))
            
            rms = librosa.feature.rms(y=y)[0]
            features['energy'] = float(np.mean(rms))
            
            chroma = librosa.feature.chroma_stft(y=y, sr=sr)
            features['chroma_mean'] = float(np.mean(chroma))
            
            return features
        except Exception as e:
            print(f"Error extracting features: {e}")
            return None
    
    @staticmethod
    def estimate_valence_energy(features):
        valence = min(1.0, max(0.0, 
            (features['spectral_centroid'] / 5000) * 0.5 + 
            (features['chroma_mean']) * 0.5
        ))
        
        energy = min(1.0, max(0.0,
            (features['energy'] * 2) * 0.6 + 
            (features['tempo'] / 200) * 0.4
        ))
        
        return valence, energy
    
    @staticmethod
    def modify_audio(input_path, output_path, speed=1.0, volume_change=0):
        try:
            audio = AudioSegment.from_file(input_path)
            audio = audio + volume_change
            
            if speed != 1.0:
                new_frame_rate = int(audio.frame_rate * speed)
                audio = audio._spawn(audio.raw_data, overrides={
                    'frame_rate': new_frame_rate
                })
                audio = audio.set_frame_rate(44100)
            
            audio = audio.fade_in(2000).fade_out(3000)
            audio.export(output_path, format='mp3')
            return True
        except Exception as e:
            print(f"Error modifying audio: {e}")
            return False
    
    @staticmethod
    def create_remix(input_path, output_path, mood):
        modifications = {
            'Happy': {'speed': 1.0, 'volume': 2},
            'Sad': {'speed': 0.9, 'volume': -2},
            'Energetic': {'speed': 1.15, 'volume': 3},
            'Calm': {'speed': 0.85, 'volume': -1}
        }
        
        mod = modifications.get(mood, {'speed': 1.0, 'volume': 0})
        return AudioProcessor.modify_audio(
            input_path, output_path, 
            speed=mod['speed'], 
            volume_change=mod['volume']
        )
