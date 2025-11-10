from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import logging
from services.supabase_service import SupabaseService
from pydantic import BaseModel
import uuid

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/songs", tags=["songs"])
supabase_service = SupabaseService()

class SongCreate(BaseModel):
    title: str
    artist: str
    album: Optional[str] = None
    genre: Optional[str] = None

@router.post("/upload")
async def upload_song(
    file: UploadFile = File(...),
    title: str = Form(...),
    artist: str = Form(...),
    album: Optional[str] = Form(None),
    genre: Optional[str] = Form(None),
    uploaded_by: Optional[str] = Form(None)
):
    """Upload a new song"""
    try:
        # Validate file type
        if not file.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Check file size (max 10MB)
        contents = await file.read()
        file_size = len(contents)
        max_size = 10 * 1024 * 1024  # 10MB
        
        if file_size > max_size:
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'mp3'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Upload to Supabase storage
        audio_url = await supabase_service.upload_song_file(contents, unique_filename)
        
        # Create song entry in database
        song_data = {
            "title": title,
            "artist": artist,
            "album": album,
            "genre": genre,
            "duration_ms": 0,  # We'll calculate this later or from metadata
            "audio_url": audio_url,
            "uploaded_by": uploaded_by,
            "is_public": True
        }
        
        song = await supabase_service.create_song(song_data)
        
        return {
            "success": True,
            "song": song,
            "message": "Song uploaded successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading song: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload song")

@router.get("/")
async def get_songs(limit: int = 100):
    """Get all songs"""
    try:
        songs = await supabase_service.get_all_songs(limit)
        return {"songs": songs}
    except Exception as e:
        logger.error(f"Error fetching songs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch songs")

@router.get("/featured-playlists")
async def get_featured_playlists():
    """Get featured playlists with songs"""
    try:
        playlists = await supabase_service.get_featured_playlists()
        return {"playlists": playlists}
    except Exception as e:
        logger.error(f"Error fetching playlists: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch playlists")
