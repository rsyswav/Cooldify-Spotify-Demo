import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Player from "./components/Player";
import { mockPlaylists, mockTracks, mockMoodData, mockCurrentTrack } from "./mock";
import { Toaster } from "./components/ui/sonner";
import { toast } from "./hooks/use-toast";

const Home = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(mockCurrentTrack);

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
    toast({
      title: "Playlist Selected",
      description: `Now viewing: ${playlist.name}`,
    });
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    toast({
      title: "Now Playing",
      description: `${track.name} by ${track.artists.map(a => a.name).join(', ')}`,
    });
  };

  const handleLoginClick = () => {
    toast({
      title: "Login Feature",
      description: "Spotify OAuth login will be available after backend integration",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          playlists={mockPlaylists}
          onPlaylistSelect={handlePlaylistSelect}
          selectedPlaylist={selectedPlaylist}
        />
        <div className="flex-1 flex flex-col relative">
          <Header onLoginClick={handleLoginClick} />
          <div className="pt-16 flex-1 overflow-hidden">
            <MainContent
              playlists={mockPlaylists}
              onPlaylistSelect={handlePlaylistSelect}
              onTrackSelect={handleTrackSelect}
              tracks={mockTracks}
              moodData={mockMoodData}
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
