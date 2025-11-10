# Cooldify Backend Integration Contracts

## 1. API Contracts

### Authentication Endpoints

#### POST /api/auth/login
- **Purpose**: Initiate Spotify OAuth flow
- **Response**: Redirect URL to Spotify authorization
- **Frontend Action**: Redirect user to Spotify login

#### GET /api/auth/callback
- **Query Params**: `code` (authorization code from Spotify)
- **Response**: 
  ```json
  {
    "access_token": "string",
    "refresh_token": "string",
    "expires_in": 3600
  }
  ```
- **Frontend Action**: Store tokens in localStorage/state

#### POST /api/auth/refresh
- **Body**: `{ "refresh_token": "string" }`
- **Response**: 
  ```json
  {
    "access_token": "string",
    "expires_in": 3600
  }
  ```

### Spotify Data Endpoints

#### GET /api/playlists/featured
- **Headers**: `Authorization: Bearer {access_token}`
- **Response**: Array of featured/public playlists
- **Replaces**: `mockPlaylists` in mock.js

#### GET /api/playlists/{playlist_id}/tracks
- **Headers**: `Authorization: Bearer {access_token}`
- **Response**: Array of tracks in playlist
- **Replaces**: `mockTracks` in mock.js

#### GET /api/playlists/{playlist_id}/mood
- **Headers**: `Authorization: Bearer {access_token}`
- **Purpose**: Calculate mood based on audio features
- **Response**:
  ```json
  {
    "overall_mood": "string",
    "mood_score": 7.2,
    "energy": 0.45,
    "valence": 0.68,
    "tempo": 95,
    "danceability": 0.55,
    "description": "string"
  }
  ```
- **Replaces**: `mockMoodData` in mock.js

#### GET /api/user/playlists
- **Headers**: `Authorization: Bearer {access_token}`
- **Response**: User's personal playlists
- **Replaces**: Sidebar playlist list

## 2. Mock Data to Replace

### In mock.js (will be removed after integration):
- `mockPlaylists` → Use `/api/playlists/featured`
- `mockTracks` → Use `/api/playlists/{id}/tracks`
- `mockMoodData` → Use `/api/playlists/{id}/mood`
- `mockCurrentTrack` → Use actual track data from API

## 3. Backend Implementation Plan

### Dependencies to Install:
- `spotipy` or direct `httpx` calls to Spotify API
- Token encryption/storage utilities

### Core Backend Components:

1. **OAuth Manager** (`/backend/auth/spotify_oauth.py`)
   - Handle authorization flow
   - Token exchange
   - Token refresh logic

2. **Spotify Service** (`/backend/services/spotify_service.py`)
   - Fetch playlists
   - Fetch tracks
   - Get audio features
   - Calculate mood algorithm

3. **Mood Calculator** (`/backend/services/mood_calculator.py`)
   - Analyze audio features (energy, valence, tempo, danceability)
   - Generate mood description
   - Calculate overall mood score

4. **API Routes** (`/backend/routes/spotify_routes.py`)
   - Define all endpoints
   - Handle authentication middleware

### Environment Variables (.env):
```
SPOTIFY_CLIENT_ID=fe3c2e087b3f4d76aa7a8c10df94b734
SPOTIFY_CLIENT_SECRET=7f0f183bb3fc41b0b57741ff0a7678c8
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

## 4. Frontend Integration Changes

### Files to Update:

1. **src/App.js**
   - Add authentication state management
   - Add token storage/retrieval
   - Replace mock data with API calls
   - Add OAuth callback handler

2. **src/components/MainContent.jsx**
   - Fetch real playlists from API
   - Fetch real mood data when playlist is selected
   - Handle loading states

3. **src/components/Sidebar.jsx**
   - Fetch user's playlists after login
   - Update playlist list dynamically

4. **src/components/Header.jsx**
   - Implement real login flow
   - Show user info after login
   - Add logout functionality

5. **Create: src/services/spotifyApi.js**
   - Centralized API client
   - Handle token management
   - Automatic token refresh

### Authentication Flow:
1. User clicks "Log in with Spotify"
2. Redirect to `/api/auth/login` → Spotify OAuth
3. Spotify redirects to `/callback` with code
4. Frontend sends code to `/api/auth/callback`
5. Backend exchanges code for tokens
6. Frontend stores tokens and fetches data

## 5. Mood Algorithm Logic

### Audio Features Used:
- **Energy** (0-1): Intensity and activity
- **Valence** (0-1): Musical positivity (happy/cheerful vs sad/depressed)
- **Tempo** (BPM): Speed of the track
- **Danceability** (0-1): How suitable for dancing

### Mood Categories:
- **Energetic & Happy**: High energy (>0.7), High valence (>0.7)
- **Relaxed & Cool**: Low-medium energy (0.3-0.6), Medium-high valence (0.5-0.8)
- **Melancholic**: Low energy (<0.4), Low valence (<0.4)
- **Intense**: High energy (>0.7), Low-medium valence (0.3-0.6)

### Overall Mood Score Calculation:
```
mood_score = (valence * 4) + (1 - abs(energy - 0.5)) * 3 + (danceability * 3)
Normalized to 0-10 scale
```

## 6. Error Handling

- Token expiration → Auto-refresh
- API rate limits → Show user-friendly message
- Network errors → Retry logic
- Invalid tokens → Re-authenticate

## 7. Testing Checklist

- [ ] OAuth login flow works
- [ ] Featured playlists load correctly
- [ ] Track list displays with real data
- [ ] Mood analysis calculates correctly
- [ ] Player plays tracks (Web Playback SDK)
- [ ] Token refresh works automatically
- [ ] Logout clears tokens
- [ ] Error states display properly
