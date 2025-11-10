import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, LogOut, ExternalLink, Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Header = ({ onLoginClick, onLogout, isAuthenticated, userProfile, onSearch, onTrackSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim() || !isAuthenticated) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);
    try {
      const results = await onSearch(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 2) {
      const timeoutId = setTimeout(() => {
        handleSearch(value);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleTrackClick = (track) => {
    onTrackSelect(track);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  return (
    <div className="h-16 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm flex items-center justify-between px-8 absolute top-0 left-64 right-0 z-10">
      {/* Navigation Arrows */}
      <div className="flex gap-4 items-center flex-1">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/40 hover:bg-black/60 text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/40 hover:bg-black/60 text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={isAuthenticated ? "What do you want to play?" : "Log in to search"}
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => searchQuery.length > 2 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              disabled={!isAuthenticated}
              className="w-full pl-10 pr-10 py-2 bg-white text-black placeholder:text-gray-500 border-0 rounded-full focus:ring-2 focus:ring-cyan-400 disabled:bg-gray-700 disabled:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-gray-900 rounded-lg shadow-2xl border border-gray-800 max-h-96 overflow-y-auto z-50">
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackClick(track)}
                  className="flex items-center p-3 hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-800 last:border-0"
                >
                  <img
                    src={track.album?.images?.[0]?.url || '/placeholder.png'}
                    alt={track.name}
                    className="w-10 h-10 rounded shadow-md"
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{track.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {track.artists?.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs ml-2">
                    {formatDuration(track.duration_ms)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {showResults && searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
            <div className="absolute top-full mt-2 w-full bg-gray-900 rounded-lg shadow-2xl border border-gray-800 p-4 text-center z-50">
              <p className="text-gray-400 text-sm">No results found</p>
            </div>
          )}
        </div>
      </div>

      {/* Login/Profile Button */}
      <div className="flex items-center gap-4">
        {isAuthenticated && userProfile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full h-10 px-3 hover:bg-gray-800 transition-all"
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={userProfile.images?.[0]?.url} alt={userProfile.display_name} />
                  <AvatarFallback className="bg-cyan-500 text-black font-semibold">
                    {userProfile.display_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white font-medium">{userProfile.display_name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-gray-900 border-gray-700">
              <DropdownMenuLabel className="text-gray-300">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-white">{userProfile.display_name}</p>
                  <p className="text-xs text-gray-400">{userProfile.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
                onClick={() => window.open(userProfile.external_urls?.spotify, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Spotify
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                className="text-red-400 hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            className="rounded-full border-gray-600 text-white hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 transition-all"
            onClick={onLoginClick}
          >
            <User className="mr-2 h-4 w-4" />
            Log in with Spotify
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
