import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Player from "./components/Player";
import CallbackPage from "./components/CallbackPage";
import { mockPlaylists, mockTracks, mockMoodData, mockCurrentTrack } from "./mock";
import { Toaster } from "./components/ui/sonner";
import { toast } from "./hooks/use-toast";
import spotifyApi from "./services/spotifyApi";

const Home = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(mockCurrentTrack);
  const [playlists, setPlaylists] = useState(mockPlaylists);
  const [tracks, setTracks] = useState(mockTracks);
  const [moodData, setMoodData] = useState(mockMoodData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = spotifyApi.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load user profile
      const profile = await spotifyApi.getUserProfile();
      if (profile) {
        setUserProfile(profile);
      }

      // Load featured playlists
      const featured = await spotifyApi.getFeaturedPlaylists(20);
      if (featured && featured.length > 0) {
        setPlaylists(featured);
      }

      // Load user's playlists for sidebar
      const userPlaylistsData = await spotifyApi.getUserPlaylists(50);
      if (userPlaylistsData && userPlaylistsData.length > 0) {
        setUserPlaylists(userPlaylistsData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load playlists. Using demo data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistSelect = async (playlist) => {
    setSelectedPlaylist(playlist);
    
    if (!isAuthenticated) {
      toast({
        title: "Playlist Selected",
        description: `Now viewing: ${playlist.name}`,
      });
      return;
    }

    setLoading(true);
    try {
      // Load tracks for selected playlist
      const playlistTracks = await spotifyApi.getPlaylistTracks(playlist.id);
      console.log('Playlist tracks loaded:', playlistTracks?.length);
      
      if (playlistTracks && playlistTracks.length > 0) {
        setTracks(playlistTracks);
        
        // Load mood data for playlist
        try {
          const mood = await spotifyApi.getPlaylistMood(playlist.id);
          if (mood) {
            setMoodData(mood);
          }
        } catch (moodError) {
          console.error('Error loading mood data:', moodError);
          // Continue even if mood fails
        }

        toast({
          title: "Playlist Loaded",
          description: `${playlist.name} - ${playlistTracks.length} tracks`,
        });
      } else {
        toast({
          title: "Empty Playlist",
          description: `${playlist.name} has no tracks`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
      toast({
        title: "Error",
        description: "Failed to load playlist details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      const results = await spotifyApi.searchTracks(query, 20);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search tracks.",
        variant: "destructive"
      });
      return [];
    }
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    toast({
      title: "Now Playing",
      description: `${track.name} by ${track.artists.map(a => a.name).join(', ')}`,
    });
  };

  const handleLoginClick = async () => {
    try {
      const authUrl = await spotifyApi.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating login:', error);
      toast({
        title: "Login Error",
        description: "Failed to initiate Spotify login. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    spotifyApi.clearTokens();
    setIsAuthenticated(false);
    setUserProfile(null);
    setPlaylists(mockPlaylists);
    setTracks(mockTracks);
    setMoodData(mockMoodData);
    setUserPlaylists([]);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const allPlaylists = isAuthenticated && userPlaylists.length > 0 
    ? [...userPlaylists] 
    : mockPlaylists;

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          playlists={allPlaylists}
          onPlaylistSelect={handlePlaylistSelect}
          selectedPlaylist={selectedPlaylist}
          onTrackSelect={handleTrackSelect}
          isAuthenticated={isAuthenticated}
          onSearch={handleSearch}
        />
        <div className="flex-1 flex flex-col relative">
          <Header 
            onLoginClick={handleLoginClick}
            onLogout={handleLogout}
            isAuthenticated={isAuthenticated}
            userProfile={userProfile}
            onSearch={handleSearch}
            onTrackSelect={handleTrackSelect}
          />
          <div className="pt-16 flex-1 overflow-hidden">
            <MainContent
              playlists={playlists}
              onPlaylistSelect={handlePlaylistSelect}
              onTrackSelect={handleTrackSelect}
              tracks={tracks}
              moodData={moodData}
              loading={loading}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </div>
      <Player currentTrack={currentTrack} />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
