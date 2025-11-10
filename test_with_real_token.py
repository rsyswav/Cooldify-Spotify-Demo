#!/usr/bin/env python3
"""
Test with real Spotify Client Credentials token to debug playlist data structure
"""

import asyncio
import httpx
import json
import os
import base64
from pathlib import Path

# Load environment variables
def load_env():
    env_path = Path('/app/backend/.env')
    env_vars = {}
    try:
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value.strip('"')
    except FileNotFoundError:
        pass
    return env_vars

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

async def get_client_credentials_token(client_id, client_secret):
    """Get access token using Client Credentials flow"""
    try:
        # Encode client credentials
        credentials = f"{client_id}:{client_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            'Authorization': f'Basic {encoded_credentials}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'grant_type': 'client_credentials'
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                'https://accounts.spotify.com/api/token',
                headers=headers,
                data=data
            )
            
            if response.status_code == 200:
                token_data = response.json()
                return token_data.get('access_token')
            else:
                print(f"Failed to get token: {response.status_code} - {response.text}")
                return None
                
    except Exception as e:
        print(f"Error getting token: {e}")
        return None

async def test_playlist_with_real_token():
    """Test playlist endpoints with real Client Credentials token"""
    env_vars = load_env()
    client_id = env_vars.get('SPOTIFY_CLIENT_ID')
    client_secret = env_vars.get('SPOTIFY_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        print("❌ Missing Spotify credentials in .env file")
        return
    
    print(f"🔑 Getting Client Credentials token...")
    access_token = await get_client_credentials_token(client_id, client_secret)
    
    if not access_token:
        print("❌ Failed to get access token")
        return
    
    print(f"✅ Got access token: {access_token[:20]}...")
    
    BASE_URL = get_backend_url()
    API_BASE = f"{BASE_URL}/api"
    playlist_id = "5IFOShdDVduOliVexlcD4g"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        print(f"\n🎵 Testing playlist: {playlist_id}")
        print(f"🔗 Backend URL: {BASE_URL}")
        print("=" * 60)
        
        # Test 1: Get playlist tracks with real token
        print("\n1️⃣ Testing playlist tracks with real token:")
        try:
            headers = {"Authorization": f"Bearer {access_token}"}
            response = await client.get(f"{API_BASE}/spotify/playlists/{playlist_id}/tracks", headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                tracks = data.get('tracks', [])
                print(f"   ✅ Tracks count: {len(tracks)}")
                
                if tracks:
                    print(f"   📋 First track keys: {list(tracks[0].keys())}")
                    
                    # Check for preview_url
                    preview_urls = []
                    for i, track in enumerate(tracks[:5]):
                        preview_url = track.get('preview_url')
                        preview_urls.append(preview_url)
                        if preview_url:
                            print(f"   🎵 Track {i+1} preview: {preview_url}")
                        else:
                            print(f"   ❌ Track {i+1} no preview: {track.get('name', 'Unknown')}")
                    
                    print(f"   📊 Preview URLs available: {sum(1 for url in preview_urls if url)}/{len(preview_urls)}")
                    
                    # Show sample track structure
                    print(f"\n   📝 Sample track structure:")
                    sample_track = tracks[0]
                    for key, value in sample_track.items():
                        if isinstance(value, dict):
                            print(f"      {key}: {type(value).__name__} with keys {list(value.keys())}")
                        elif isinstance(value, list):
                            print(f"      {key}: {type(value).__name__} with {len(value)} items")
                        else:
                            print(f"      {key}: {value}")
                else:
                    print("   ❌ No tracks returned")
            else:
                print(f"   ❌ Error: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Exception: {e}")
        
        # Test 2: Get playlist mood with real token
        print("\n2️⃣ Testing playlist mood with real token:")
        try:
            headers = {"Authorization": f"Bearer {access_token}"}
            response = await client.get(f"{API_BASE}/spotify/playlists/{playlist_id}/mood", headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Mood data: {json.dumps(data, indent=2)}")
            else:
                print(f"   ❌ Error: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Exception: {e}")
        
        # Test 3: Direct Spotify API call for comparison
        print("\n3️⃣ Testing direct Spotify API call:")
        try:
            headers = {"Authorization": f"Bearer {access_token}"}
            response = await client.get(f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks?limit=5", headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                items = data.get('items', [])
                print(f"   ✅ Direct API tracks count: {len(items)}")
                
                if items:
                    track = items[0].get('track', {})
                    print(f"   📋 Direct API track keys: {list(track.keys())}")
                    print(f"   🎵 Preview URL: {track.get('preview_url')}")
                    print(f"   🎵 Track name: {track.get('name')}")
                    print(f"   👤 Artist: {track.get('artists', [{}])[0].get('name', 'Unknown')}")
            else:
                print(f"   ❌ Error: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_playlist_with_real_token())