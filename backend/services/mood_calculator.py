from typing import List, Dict
import statistics

class MoodCalculator:
    """Calculate playlist mood based on audio features"""

    @staticmethod
    def calculate_mood(audio_features: List[Dict]) -> Dict:
        """Calculate overall mood from track audio features"""
        if not audio_features:
            return {
                'overall_mood': 'Unknown',
                'mood_score': 0,
                'energy': 0,
                'valence': 0,
                'tempo': 0,
                'danceability': 0,
                'description': 'No audio data available'
            }

        # Calculate averages
        energy = statistics.mean([f['energy'] for f in audio_features if f])
        valence = statistics.mean([f['valence'] for f in audio_features if f])
        tempo = statistics.mean([f['tempo'] for f in audio_features if f])
        danceability = statistics.mean([f['danceability'] for f in audio_features if f])

        # Determine mood category
        mood, description = MoodCalculator._determine_mood_category(
            energy, valence, tempo, danceability
        )

        # Calculate mood score (0-10)
        mood_score = round(
            (valence * 4) + (1 - abs(energy - 0.5)) * 3 + (danceability * 3),
            1
        )

        return {
            'overall_mood': mood,
            'mood_score': mood_score,
            'energy': round(energy, 2),
            'valence': round(valence, 2),
            'tempo': round(tempo, 0),
            'danceability': round(danceability, 2),
            'description': description
        }

    @staticmethod
    def _determine_mood_category(energy: float, valence: float, tempo: float, danceability: float) -> tuple:
        """Determine mood category based on audio features"""
        # Energetic & Happy
        if energy > 0.7 and valence > 0.7:
            return (
                'Energetic & Uplifting',
                'This playlist is bursting with energy and positivity! Perfect for workouts, parties, or boosting your motivation. High tempo tracks keep the excitement going.'
            )
        
        # Relaxed & Cool (Our target mood!)
        elif 0.3 <= energy <= 0.6 and 0.5 <= valence <= 0.85:
            return (
                'Relaxed & Cool',
                'This playlist creates a calm and cool atmosphere perfect for unwinding. The moderate tempo and positive vibes help reduce stress and create a peaceful environment.'
            )
        
        # Chill & Mellow
        elif energy < 0.4 and valence > 0.5:
            return (
                'Chill & Mellow',
                'Ultra-chill vibes with mellow tones. Great for studying, meditation, or late-night relaxation. Low energy with gentle positivity creates a soothing ambiance.'
            )
        
        # Melancholic
        elif energy < 0.4 and valence < 0.4:
            return (
                'Melancholic & Reflective',
                'A contemplative playlist with introspective tones. Low energy and subdued mood create space for deep thoughts and emotional reflection.'
            )
        
        # Intense & Focused
        elif energy > 0.7 and 0.3 <= valence <= 0.6:
            return (
                'Intense & Focused',
                'High-energy tracks with serious undertones. Perfect for intense focus, gaming, or powering through challenging tasks. Maintains drive without excessive cheerfulness.'
            )
        
        # Danceable & Fun
        elif danceability > 0.7:
            return (
                'Danceable & Groovy',
                'Made for moving! High danceability with infectious rhythms. Whether you\'re at a party or dancing alone, these tracks will get you grooving.'
            )
        
        # Balanced
        else:
            return (
                'Balanced & Versatile',
                'A well-rounded mix with moderate energy and mood. Versatile enough for various activities - background music, casual listening, or light tasks.'
            )
