from fastapi import APIRouter, HTTPException, Header, Query
from typing import Optional
import logging
from services.spotify_oauth import SpotifyOAuth
from services.spotify_service import SpotifyService
from services.mood_calculator import MoodCalculator
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/spotify", tags=["spotify"])
oauth = SpotifyOAuth()

class RefreshTokenRequest(BaseModel):
    refresh_token: str

@router.get("/auth/login")
async def spotify_login():
    """Initiate Spotify OAuth flow"""
    try:
        auth_url = oauth.get_auth_url()
        return {"auth_url": auth_url}
    except Exception as e:
        logger.error(f"Error generating auth URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate authorization URL")

@router.get("/auth/callback")
async def spotify_callback(code: str = Query(...)):
    """Handle Spotify OAuth callback"""
    try:
        tokens = await oauth.exchange_code(code)
        return tokens
    except Exception as e:
        logger.error(f"Error exchanging code: {e}")
        raise HTTPException(status_code=400, detail="Failed to exchange authorization code")

@router.post("/auth/refresh")
async def refresh_access_token(request: RefreshTokenRequest):
    """Refresh Spotify access token"""
    try:
        tokens = await oauth.refresh_token(request.refresh_token)
        return tokens
    except Exception as e:
        logger.error(f"Error refreshing token: {e}")
        raise HTTPException(status_code=400, detail="Failed to refresh access token")

@router.get("/playlists/featured")
async def get_featured_playlists(
    authorization: str = Header(...),
    limit: int = Query(20, ge=1, le=50)
):
    """Get featured playlists"""
    try:
        access_token = authorization.replace("Bearer ", "")
        service = SpotifyService(access_token)
        playlists = await service.get_featured_playlists(limit)
        return {"playlists": playlists}
    except Exception as e:
        logger.error(f"Error fetching featured playlists: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured playlists")

@router.get("/playlists/user")
async def get_user_playlists(
    authorization: str = Header(...),
    limit: int = Query(50, ge=1, le=50)
):
    """Get user's playlists"""
    try:
        access_token = authorization.replace("Bearer ", "")
        service = SpotifyService(access_token)
        playlists = await service.get_user_playlists(limit)
        return {"playlists": playlists}
    except Exception as e:
        logger.error(f"Error fetching user playlists: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user playlists")

@router.get("/playlists/{playlist_id}/tracks")
async def get_playlist_tracks(
    playlist_id: str,
    authorization: str = Header(...),
    limit: int = Query(50, ge=1, le=100)
):
    """Get tracks from a playlist"""
    try:
        access_token = authorization.replace("Bearer ", "")
        service = SpotifyService(access_token)
        tracks = await service.get_playlist_tracks(playlist_id, limit)
        return {"tracks": tracks}
    except Exception as e:
        logger.error(f"Error fetching playlist tracks: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch playlist tracks")

@router.get("/playlists/{playlist_id}/mood")
async def get_playlist_mood(
    playlist_id: str,
    authorization: str = Header(...)
):
    """Calculate mood for a playlist based on audio features"""
    try:
        access_token = authorization.replace("Bearer ", "")
        service = SpotifyService(access_token)
        
        # Get playlist tracks
        tracks = await service.get_playlist_tracks(playlist_id, limit=50)
        
        if not tracks:
            raise HTTPException(status_code=404, detail="No tracks found in playlist")
        
        # Get track IDs
        track_ids = [track['id'] for track in tracks if track and track.get('id')]
        
        # Get audio features
        audio_features = await service.get_audio_features(track_ids)
        
        # Calculate mood
        mood_data = MoodCalculator.calculate_mood(audio_features)
        
        return mood_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calculating playlist mood: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate playlist mood")

@router.get("/user/profile")
async def get_user_profile(authorization: str = Header(...)):
    """Get current user's profile"""
    try:
        access_token = authorization.replace("Bearer ", "")
        service = SpotifyService(access_token)
        profile = await service.get_user_profile()
        
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        return profile
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user profile")

@router.get("/search")
async def search_tracks(
    authorization: str = Header(...),
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=50)
):
    """Search for tracks"""
    try:
        access_token = authorization.replace("Bearer ", "")
        service = SpotifyService(access_token)
        tracks = await service.search_tracks(q, limit)
        return {"tracks": tracks}
    except Exception as e:
        logger.error(f"Error searching tracks: {e}")
        raise HTTPException(status_code=500, detail="Failed to search tracks")
