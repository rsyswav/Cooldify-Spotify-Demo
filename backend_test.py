#!/usr/bin/env python3
"""
Backend Test Suite for Cooldify Spotify API Integration
Tests all Spotify endpoints for proper functionality and error handling
"""

import asyncio
import httpx
import json
import os
from typing import Dict, Any
from urllib.parse import urlparse, parse_qs

# Get backend URL from frontend .env file
def get_backend_url():
    """Read backend URL from frontend .env file"""
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        return "http://localhost:8001"  # fallback
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

class SpotifyAPITester:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.test_results = []
        
    async def close(self):
        await self.client.aclose()
    
    def log_test(self, test_name: str, status: str, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "status": status,
            "details": details
        }
        self.test_results.append(result)
        print(f"[{status}] {test_name}: {details}")
    
    async def test_auth_login(self):
        """Test GET /api/spotify/auth/login"""
        try:
            response = await self.client.get(f"{API_BASE}/spotify/auth/login")
            
            if response.status_code == 200:
                data = response.json()
                if "auth_url" in data:
                    auth_url = data["auth_url"]
                    # Validate it's a proper Spotify auth URL
                    if "accounts.spotify.com/authorize" in auth_url:
                        # Parse URL to check required parameters
                        parsed = urlparse(auth_url)
                        params = parse_qs(parsed.query)
                        
                        required_params = ['client_id', 'response_type', 'redirect_uri', 'scope']
                        missing_params = [p for p in required_params if p not in params]
                        
                        if not missing_params:
                            self.log_test("Auth Login", "PASS", f"Valid Spotify auth URL returned: {auth_url[:100]}...")
                        else:
                            self.log_test("Auth Login", "FAIL", f"Missing required parameters: {missing_params}")
                    else:
                        self.log_test("Auth Login", "FAIL", f"Invalid auth URL format: {auth_url}")
                else:
                    self.log_test("Auth Login", "FAIL", f"Missing 'auth_url' in response: {data}")
            else:
                self.log_test("Auth Login", "FAIL", f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Auth Login", "ERROR", f"Exception: {str(e)}")
    
    async def test_auth_callback(self):
        """Test GET /api/spotify/auth/callback"""
        try:
            # Test with dummy code (should fail gracefully)
            response = await self.client.get(f"{API_BASE}/spotify/auth/callback?code=test_code")
            
            # Should return 400 for invalid code, but endpoint should respond
            if response.status_code == 400:
                self.log_test("Auth Callback", "PASS", "Properly handles invalid authorization code with 400 status")
            elif response.status_code == 422:
                self.log_test("Auth Callback", "PASS", "Validation error for invalid code (422)")
            else:
                self.log_test("Auth Callback", "FAIL", f"Unexpected status code {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Auth Callback", "ERROR", f"Exception: {str(e)}")
    
    async def test_auth_callback_missing_code(self):
        """Test GET /api/spotify/auth/callback without code parameter"""
        try:
            response = await self.client.get(f"{API_BASE}/spotify/auth/callback")
            
            # Should return 422 for missing required parameter
            if response.status_code == 422:
                self.log_test("Auth Callback (No Code)", "PASS", "Properly validates missing code parameter")
            else:
                self.log_test("Auth Callback (No Code)", "FAIL", f"Expected 422, got {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Auth Callback (No Code)", "ERROR", f"Exception: {str(e)}")
    
    async def test_featured_playlists_no_auth(self):
        """Test GET /api/spotify/playlists/featured without authorization"""
        try:
            response = await self.client.get(f"{API_BASE}/spotify/playlists/featured")
            
            # Should return 422 for missing authorization header
            if response.status_code == 422:
                self.log_test("Featured Playlists (No Auth)", "PASS", "Properly requires authorization header")
            else:
                self.log_test("Featured Playlists (No Auth)", "FAIL", f"Expected 422, got {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Featured Playlists (No Auth)", "ERROR", f"Exception: {str(e)}")
    
    async def test_featured_playlists_with_fake_token(self):
        """Test GET /api/spotify/playlists/featured with fake token"""
        try:
            headers = {"Authorization": "Bearer fake_token_12345"}
            response = await self.client.get(f"{API_BASE}/spotify/playlists/featured", headers=headers)
            
            # Should return 500 (internal error due to invalid token) or handle gracefully
            if response.status_code in [401, 500]:
                self.log_test("Featured Playlists (Fake Token)", "PASS", f"Handles invalid token appropriately ({response.status_code})")
            else:
                self.log_test("Featured Playlists (Fake Token)", "FAIL", f"Unexpected status {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Featured Playlists (Fake Token)", "ERROR", f"Exception: {str(e)}")
    
    async def test_user_playlists_no_auth(self):
        """Test GET /api/spotify/playlists/user without authorization"""
        try:
            response = await self.client.get(f"{API_BASE}/spotify/playlists/user")
            
            if response.status_code == 422:
                self.log_test("User Playlists (No Auth)", "PASS", "Properly requires authorization header")
            else:
                self.log_test("User Playlists (No Auth)", "FAIL", f"Expected 422, got {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("User Playlists (No Auth)", "ERROR", f"Exception: {str(e)}")
    
    async def test_playlist_tracks_no_auth(self):
        """Test GET /api/spotify/playlists/{playlist_id}/tracks without authorization"""
        try:
            playlist_id = "37i9dQZF1DXcBWIGoYBM5M"  # Sample playlist ID
            response = await self.client.get(f"{API_BASE}/spotify/playlists/{playlist_id}/tracks")
            
            if response.status_code == 422:
                self.log_test("Playlist Tracks (No Auth)", "PASS", "Properly requires authorization header")
            else:
                self.log_test("Playlist Tracks (No Auth)", "FAIL", f"Expected 422, got {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Playlist Tracks (No Auth)", "ERROR", f"Exception: {str(e)}")
    
    async def test_playlist_mood_no_auth(self):
        """Test GET /api/spotify/playlists/{playlist_id}/mood without authorization"""
        try:
            playlist_id = "37i9dQZF1DXcBWIGoYBM5M"  # Sample playlist ID
            response = await self.client.get(f"{API_BASE}/spotify/playlists/{playlist_id}/mood")
            
            if response.status_code == 422:
                self.log_test("Playlist Mood (No Auth)", "PASS", "Properly requires authorization header")
            else:
                self.log_test("Playlist Mood (No Auth)", "FAIL", f"Expected 422, got {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Playlist Mood (No Auth)", "ERROR", f"Exception: {str(e)}")
    
    async def test_user_profile_no_auth(self):
        """Test GET /api/spotify/user/profile without authorization"""
        try:
            response = await self.client.get(f"{API_BASE}/spotify/user/profile")
            
            if response.status_code == 422:
                self.log_test("User Profile (No Auth)", "PASS", "Properly requires authorization header")
            else:
                self.log_test("User Profile (No Auth)", "FAIL", f"Expected 422, got {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("User Profile (No Auth)", "ERROR", f"Exception: {str(e)}")
    
    async def test_playlist_tracks_with_fake_token(self):
        """Test playlist tracks endpoint with fake token"""
        try:
            playlist_id = "37i9dQZF1DXcBWIGoYBM5M"
            headers = {"Authorization": "Bearer fake_token_12345"}
            response = await self.client.get(f"{API_BASE}/spotify/playlists/{playlist_id}/tracks", headers=headers)
            
            if response.status_code in [401, 500]:
                self.log_test("Playlist Tracks (Fake Token)", "PASS", f"Handles invalid token appropriately ({response.status_code})")
            else:
                self.log_test("Playlist Tracks (Fake Token)", "FAIL", f"Unexpected status {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Playlist Tracks (Fake Token)", "ERROR", f"Exception: {str(e)}")
    
    async def test_playlist_mood_with_fake_token(self):
        """Test playlist mood endpoint with fake token"""
        try:
            playlist_id = "37i9dQZF1DXcBWIGoYBM5M"
            headers = {"Authorization": "Bearer fake_token_12345"}
            response = await self.client.get(f"{API_BASE}/spotify/playlists/{playlist_id}/mood", headers=headers)
            
            if response.status_code in [401, 500]:
                self.log_test("Playlist Mood (Fake Token)", "PASS", f"Handles invalid token appropriately ({response.status_code})")
            else:
                self.log_test("Playlist Mood (Fake Token)", "FAIL", f"Unexpected status {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Playlist Mood (Fake Token)", "ERROR", f"Exception: {str(e)}")
    
    async def test_user_profile_with_fake_token(self):
        """Test user profile endpoint with fake token"""
        try:
            headers = {"Authorization": "Bearer fake_token_12345"}
            response = await self.client.get(f"{API_BASE}/spotify/user/profile", headers=headers)
            
            if response.status_code in [401, 500]:
                self.log_test("User Profile (Fake Token)", "PASS", f"Handles invalid token appropriately ({response.status_code})")
            else:
                self.log_test("User Profile (Fake Token)", "FAIL", f"Unexpected status {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("User Profile (Fake Token)", "ERROR", f"Exception: {str(e)}")
    
    async def test_search_endpoint_no_auth(self):
        """Test search endpoint without authorization"""
        try:
            response = await self.client.get(f"{API_BASE}/spotify/search?q=test")
            
            if response.status_code == 422:
                self.log_test("Search (No Auth)", "PASS", "Properly requires authorization header")
            else:
                self.log_test("Search (No Auth)", "FAIL", f"Expected 422, got {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Search (No Auth)", "ERROR", f"Exception: {str(e)}")
    
    async def test_basic_api_health(self):
        """Test basic API health"""
        try:
            response = await self.client.get(f"{API_BASE}/")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("API Health", "PASS", f"API is responding: {data['message']}")
                else:
                    self.log_test("API Health", "PASS", "API is responding")
            else:
                self.log_test("API Health", "FAIL", f"API not responding properly: {response.status_code}")
                
        except Exception as e:
            self.log_test("API Health", "ERROR", f"Cannot reach API: {str(e)}")
    
    async def run_all_tests(self):
        """Run all test cases"""
        print(f"🎵 Starting Cooldify Spotify API Tests")
        print(f"🔗 Testing backend at: {BASE_URL}")
        print("=" * 60)
        
        # Test basic API health first
        await self.test_basic_api_health()
        
        # Test auth endpoints
        print("\n🔐 Testing Authentication Endpoints:")
        await self.test_auth_login()
        await self.test_auth_callback()
        await self.test_auth_callback_missing_code()
        
        # Test playlist endpoints without auth
        print("\n🎵 Testing Playlist Endpoints (No Auth):")
        await self.test_featured_playlists_no_auth()
        await self.test_user_playlists_no_auth()
        await self.test_playlist_tracks_no_auth()
        await self.test_playlist_mood_no_auth()
        
        # Test playlist endpoints with fake token
        print("\n🎵 Testing Playlist Endpoints (Fake Token):")
        await self.test_featured_playlists_with_fake_token()
        await self.test_playlist_tracks_with_fake_token()
        await self.test_playlist_mood_with_fake_token()
        
        # Test user profile endpoint
        print("\n👤 Testing User Profile Endpoint:")
        await self.test_user_profile_no_auth()
        await self.test_user_profile_with_fake_token()
        
        # Test search endpoint
        print("\n🔍 Testing Search Endpoint:")
        await self.test_search_endpoint_no_auth()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY:")
        
        passed = len([r for r in self.test_results if r["status"] == "PASS"])
        failed = len([r for r in self.test_results if r["status"] == "FAIL"])
        errors = len([r for r in self.test_results if r["status"] == "ERROR"])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"🚨 Errors: {errors}")
        print(f"📈 Total: {total}")
        
        if failed > 0 or errors > 0:
            print("\n🔍 FAILED/ERROR TESTS:")
            for result in self.test_results:
                if result["status"] in ["FAIL", "ERROR"]:
                    print(f"  {result['status']}: {result['test']} - {result['details']}")
        
        return self.test_results

async def main():
    """Main test runner"""
    tester = SpotifyAPITester()
    try:
        results = await tester.run_all_tests()
        return results
    finally:
        await tester.close()

if __name__ == "__main__":
    asyncio.run(main())