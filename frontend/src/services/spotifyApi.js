import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api/spotify`;

class SpotifyAPI {
  constructor() {
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.refreshToken = localStorage.getItem('spotify_refresh_token');
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('spotify_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('spotify_refresh_token', refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
  }

  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`
    };
  }

  async getAuthUrl() {
    try {
      const response = await axios.get(`${API_BASE}/auth/login`);
      return response.data.auth_url;
    } catch (error) {
      console.error('Error getting auth URL:', error);
      throw error;
    }
  }

  async exchangeCode(code) {
    try {
      const response = await axios.get(`${API_BASE}/auth/callback`, {
        params: { code }
      });
      const { access_token, refresh_token } = response.data;
      this.setTokens(access_token, refresh_token);
      return response.data;
    } catch (error) {
      console.error('Error exchanging code:', error);
      throw error;
    }
  }

  async refreshAccessToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await axios.post(`${API_BASE}/auth/refresh`, {
        refresh_token: this.refreshToken
      });
      const { access_token } = response.data;
      this.setTokens(access_token, this.refreshToken);
      return access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearTokens();
      throw error;
    }
  }

  async getFeaturedPlaylists(limit = 20) {
    try {
      const response = await axios.get(`${API_BASE}/playlists/featured`, {
        headers: this.getAuthHeaders(),
        params: { limit }
      });
      return response.data.playlists;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.refreshAccessToken();
        return this.getFeaturedPlaylists(limit);
      }
      console.error('Error fetching featured playlists:', error);
      throw error;
    }
  }

  async getUserPlaylists(limit = 50) {
    try {
      const response = await axios.get(`${API_BASE}/playlists/user`, {
        headers: this.getAuthHeaders(),
        params: { limit }
      });
      return response.data.playlists;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.refreshAccessToken();
        return this.getUserPlaylists(limit);
      }
      console.error('Error fetching user playlists:', error);
      throw error;
    }
  }

  async getPlaylistTracks(playlistId, limit = 50) {
    try {
      const response = await axios.get(`${API_BASE}/playlists/${playlistId}/tracks`, {
        headers: this.getAuthHeaders(),
        params: { limit }
      });
      return response.data.tracks;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.refreshAccessToken();
        return this.getPlaylistTracks(playlistId, limit);
      }
      console.error('Error fetching playlist tracks:', error);
      throw error;
    }
  }

  async getPlaylistMood(playlistId) {
    try {
      const response = await axios.get(`${API_BASE}/playlists/${playlistId}/mood`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.refreshAccessToken();
        return this.getPlaylistMood(playlistId);
      }
      console.error('Error fetching playlist mood:', error);
      throw error;
    }
  }

  async getUserProfile() {
    try {
      const response = await axios.get(`${API_BASE}/user/profile`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.refreshAccessToken();
        return this.getUserProfile();
      }
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async searchTracks(query, limit = 20) {
    try {
      const response = await axios.get(`${API_BASE}/search`, {
        headers: this.getAuthHeaders(),
        params: { q: query, limit }
      });
      return response.data.tracks;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.refreshAccessToken();
        return this.searchTracks(query, limit);
      }
      console.error('Error searching tracks:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.accessToken;
  }
}

export default new SpotifyAPI();
