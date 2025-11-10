import os
from supabase import create_client, Client
from typing import List, Dict, Optional
import logging
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")
        self.supabase: Client = create_client(url, key)
        self.storage_bucket = "audio-files"
    
    async def upload_song_file(self, file_data: bytes, filename: str) -> str:
        """Upload audio file to Supabase storage"""
        try:
            # Upload to storage
            response = self.supabase.storage.from_(self.storage_bucket).upload(
                filename,
                file_data,
                file_options={"content-type": "audio/mpeg"}
            )
            
            # Get public URL
            public_url = self.supabase.storage.from_(self.storage_bucket).get_public_url(filename)
            return public_url
        except Exception as e:
            logger.error(f"Error uploading file: {e}")
            raise
    
    async def create_song(self, song_data: Dict) -> Dict:
        """Create a new song entry in database"""
        try:
            response = self.supabase.table("songs").insert(song_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error creating song: {e}")
            raise
    
    async def get_all_songs(self, limit: int = 100) -> List[Dict]:
        """Get all public songs"""
        try:
            response = self.supabase.table("songs")\
                .select("*")\
                .eq("is_public", True)\
                .order("created_at", desc=True)\
                .limit(limit)\
                .execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching songs: {e}")
            return []
    
    async def get_featured_playlists(self) -> List[Dict]:
        """Get featured playlists with songs"""
        try:
            response = self.supabase.table("playlists")\
                .select("*, playlist_songs(*, songs(*))")\
                .eq("is_featured", True)\
                .execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching playlists: {e}")
            return []
    
    async def create_playlist(self, playlist_data: Dict) -> Dict:
        """Create a new playlist"""
        try:
            response = self.supabase.table("playlists").insert(playlist_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error creating playlist: {e}")
            raise
    
    async def add_song_to_playlist(self, playlist_id: str, song_id: str, position: int) -> Dict:
        """Add a song to a playlist"""
        try:
            data = {
                "playlist_id": playlist_id,
                "song_id": song_id,
                "position": position
            }
            response = self.supabase.table("playlist_songs").insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error adding song to playlist: {e}")
            raise
