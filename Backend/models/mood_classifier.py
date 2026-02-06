import numpy as np

class MoodClassifier:
    def __init__(self):
        self.mood_labels = ['Happy', 'Sad', 'Energetic', 'Calm']
        
    def classify_mood_simple(self, valence, energy):
        """Simple rule-based mood classification"""
        if valence >= 0.6 and energy >= 0.6:
            return 'Happy', 0.85
        elif valence < 0.4 and energy < 0.4:
            return 'Sad', 0.80
        elif energy >= 0.6:
            return 'Energetic', 0.82
        else:
            return 'Calm', 0.78
    
    def get_mood_recommendations(self, mood):
        """Get target audio features for mood-based recommendations"""
        mood_targets = {
            'Happy': {'valence': 0.8, 'energy': 0.8, 'tempo': 120},
            'Sad': {'valence': 0.3, 'energy': 0.3, 'tempo': 80},
            'Energetic': {'valence': 0.7, 'energy': 0.9, 'tempo': 140},
            'Calm': {'valence': 0.5, 'energy': 0.4, 'tempo': 90}
        }
        return mood_targets.get(mood, mood_targets['Calm'])
    
def get_seed_genres(self, mood):
    """Get seed genres using only basic Spotify genres"""
    genre_mapping = {
        'Happy': ['pop', 'dance'],
        'Sad': ['acoustic'],
        'Energetic': ['dance', 'pop'],
        'Calm': ['acoustic', 'pop']
    }
    return genre_mapping.get(mood, ['pop'])

