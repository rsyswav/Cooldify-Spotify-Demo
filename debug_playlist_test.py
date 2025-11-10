#!/usr/bin/env python3
"""
Debug test for specific playlist ID to understand the data structure
"""

import asyncio
import httpx
import json

# Get backend URL from frontend .env file
def get_backend_url():
    """Read backend URL from frontend .env file"""
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        return "http://localhost:8001"
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

async def debug_playlist():
    """Debug the specific playlist issue"""
    playlist_id = "5IFOShdDVduOliVexlcD4g"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        print(f"🔍 Debugging Playlist: {playlist_id}")
        print(f"🔗 Backend URL: {BASE_URL}")
        print("=" * 60)
        
        # Test 1: No authorization header
        print("\n1️⃣ Testing without authorization header:")
        try:
            response = await client.get(f"{API_BASE}/spotify/playlists/{playlist_id}/tracks")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Test 2: With fake token
        print("\n2️⃣ Testing with fake token:")
        try:
            headers = {"Authorization": "Bearer fake_token_12345"}
            response = await client.get(f"{API_BASE}/spotify/playlists/{playlist_id}/tracks", headers=headers)
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                tracks = data.get('tracks', [])
                print(f"   Tracks count: {len(tracks)}")
                if tracks:
                    print(f"   First track keys: {list(tracks[0].keys())}")
                    print(f"   First track sample: {json.dumps(tracks[0], indent=2)[:500]}...")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Test 3: Mood endpoint with fake token
        print("\n3️⃣ Testing mood endpoint with fake token:")
        try:
            headers = {"Authorization": "Bearer fake_token_12345"}
            response = await client.get(f"{API_BASE}/spotify/playlists/{playlist_id}/mood", headers=headers)
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Test 4: Direct Spotify API call (to see what Spotify returns)
        print("\n4️⃣ Testing direct Spotify API call:")
        try:
            spotify_headers = {"Authorization": "Bearer fake_token_12345"}
            response = await client.get(f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks", headers=spotify_headers)
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Test 5: Check if playlist is public (no auth needed)
        print("\n5️⃣ Testing direct Spotify API without auth:")
        try:
            response = await client.get(f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
        except Exception as e:
            print(f"   Error: {e}")

if __name__ == "__main__":
    asyncio.run(debug_playlist())