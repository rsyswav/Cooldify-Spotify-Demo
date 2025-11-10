import httpx
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class SpotifyService:
    """Service for interacting with Spotify API"""

    BASE_URL = 'https://api.spotify.com/v1'

    def __init__(self, access_token: str):
        self.access_token = access_token
        self.headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

    async def get_featured_playlists(self, limit: int = 20) -> List[Dict]:
        """Get featured playlists from Spotify"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'{self.BASE_URL}/browse/featured-playlists',
                    headers=self.headers,
                    params={'limit': limit}
                )
                response.raise_for_status()
                data = response.json()
                return data.get('playlists', {}).get('items', [])
        except Exception as e:
            logger.error(f"Error fetching featured playlists: {e}")
            return []

    async def get_user_playlists(self, limit: int = 50) -> List[Dict]:
        """Get current user's playlists"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'{self.BASE_URL}/me/playlists',
                    headers=self.headers,
                    params={'limit': limit}
                )
                response.raise_for_status()
                return response.json().get('items', [])
        except Exception as e:
            logger.error(f"Error fetching user playlists: {e}")
            return []

    async def get_playlist_tracks(self, playlist_id: str, limit: int = 50) -> List[Dict]:
        """Get tracks from a playlist"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'{self.BASE_URL}/playlists/{playlist_id}/tracks',
                    headers=self.headers,
                    params={'limit': limit}
                )
                response.raise_for_status()
                items = response.json().get('items', [])
                return [item['track'] for item in items if item.get('track')]
        except Exception as e:
            logger.error(f"Error fetching playlist tracks: {e}")
            return []

    async def get_audio_features(self, track_ids: List[str]) -> List[Dict]:
        """Get audio features for multiple tracks"""
        try:
            # Spotify API accepts max 100 track IDs at once
            track_ids = track_ids[:100]
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'{self.BASE_URL}/audio-features',
                    headers=self.headers,
                    params={'ids': ','.join(track_ids)}
                )
                response.raise_for_status()
                return response.json().get('audio_features', [])
        except Exception as e:
            logger.error(f"Error fetching audio features: {e}")
            return []

    async def get_user_profile(self) -> Optional[Dict]:
        """Get current user's profile"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'{self.BASE_URL}/me',
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Error fetching user profile: {e}")
            return None

    async def search_tracks(self, query: str, limit: int = 20) -> List[Dict]:
        """Search for tracks"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'{self.BASE_URL}/search',
                    headers=self.headers,
                    params={'q': query, 'type': 'track', 'limit': limit}
                )
                response.raise_for_status()
                return response.json().get('tracks', {}).get('items', [])
        except Exception as e:
            logger.error(f"Error searching tracks: {e}")
            return []
