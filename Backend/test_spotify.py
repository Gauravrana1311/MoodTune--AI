from utils.spotify_client import SpotifyClient

# Test Spotify connection
client = SpotifyClient(use_oauth=False)

# Try to get recommendations
tracks = client.get_recommendations(
    target_valence=0.8,
    target_energy=0.8,
    target_tempo=120,
    limit=5
)

if tracks:
    print("✅ Spotify API Working!")
    print(f"Got {len(tracks)} recommendations:")
    for i, track in enumerate(tracks, 1):
        print(f"{i}. {track['name']} - {track['artists'][0]['name']}")
else:
    print("❌ No recommendations returned")
