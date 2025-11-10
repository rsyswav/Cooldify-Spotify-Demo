import React from 'react';
import { Home, Library, Plus, Heart, Music, Upload } from 'lucide-react';
import { Button } from './ui/button';
import SearchBar from './SearchBar';

const Sidebar = ({ playlists, onPlaylistSelect, selectedPlaylist, onTrackSelect, isAuthenticated, onSearch, onUploadClick }) => {
  return (
    <div className="w-64 bg-black h-full flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <img 
            src="https://img.freepik.com/premium-vector/blue-white-logo-with-letter-c-it_65335-1979.jpg" 
            alt="Cooldify Logo" 
            className="w-10 h-10 rounded-lg"
          />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Cooldify
            </h1>
            <p className="text-xs text-gray-400">Cool your mood</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Home className="mr-3 h-5 w-5" />
          Home
        </Button>
        <SearchBar 
          onTrackSelect={onTrackSelect}
          isAuthenticated={isAuthenticated}
          onSearch={onSearch}
        />
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Library className="mr-3 h-5 w-5" />
          Your Library
        </Button>
      </nav>

      <div className="mt-6 px-3 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="mr-3 h-5 w-5" />
          Create Playlist
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-cyan-400 hover:text-cyan-300 hover:bg-gray-800 transition-colors"
          onClick={onUploadClick}
        >
          <Upload className="mr-3 h-5 w-5" />
          Upload Song
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Heart className="mr-3 h-5 w-5" />
          Liked Songs
        </Button>
      </div>

      {/* Playlists */}
      <div className="mt-6 flex-1 overflow-y-auto px-3">
        <div className="border-t border-gray-800 pt-4">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => onPlaylistSelect(playlist)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedPlaylist?.id === playlist.id
                  ? 'bg-gray-800 text-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <Music className="mr-3 h-4 w-4" />
                <span className="truncate">{playlist.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
