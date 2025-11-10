import React from 'react';
import { Home, Search, Library, Plus, Heart, Music } from 'lucide-react';
import { Button } from './ui/button';

const Sidebar = ({ playlists, onPlaylistSelect, selectedPlaylist }) => {
  return (
    <div className="w-64 bg-black h-full flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Cooldify
        </h1>
        <p className="text-xs text-gray-400 mt-1">Cool your mood</p>
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
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Search className="mr-3 h-5 w-5" />
          Search
        </Button>
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
