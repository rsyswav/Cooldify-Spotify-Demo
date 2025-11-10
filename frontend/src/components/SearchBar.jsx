import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const SearchBar = ({ onTrackSelect, isAuthenticated, onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim() || !isAuthenticated) return;

    setIsSearching(true);
    try {
      const results = await onSearch(searchQuery);
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
    setQuery(value);
    
    // Debounce search
    if (value.length > 2) {
      const timeoutId = setTimeout(() => {
        handleSearch(value);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  };

  const handleTrackClick = (track) => {
    onTrackSelect(track);
    setIsOpen(false);
    setQuery('');
    setSearchResults([]);
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-3 h-5 w-5" />
        Search
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <Search className="mr-2 h-5 w-5 text-cyan-400" />
              Search Spotify
            </DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="What do you want to listen to?"
              value={query}
              onChange={handleInputChange}
              className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-cyan-400"
              autoFocus
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto mt-4">
            {!isAuthenticated ? (
              <div className="text-center py-12 text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Please log in to search Spotify</p>
              </div>
            ) : isSearching ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => handleTrackClick(track)}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer group"
                  >
                    <img
                      src={track.album?.images?.[0]?.url || '/placeholder.png'}
                      alt={track.name}
                      className="w-12 h-12 rounded shadow-md"
                    />
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{track.name}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {track.artists?.map((a) => a.name).join(', ')}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-4">
                      <p className="text-gray-400 text-sm">{track.album?.name}</p>
                      <p className="text-gray-400 text-sm w-12 text-right">
                        {formatDuration(track.duration_ms)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length > 2 ? (
              <div className="text-center py-12 text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start typing to search for songs</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBar;
