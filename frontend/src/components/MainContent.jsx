import React, { useRef, useState, useEffect } from 'react';
import { Play, TrendingUp, Activity, Music2, Gauge, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

const MainContent = ({ playlists, onPlaylistSelect, onTrackSelect, tracks, moodData, loading, isAuthenticated, uploadedSongs, selectedPlaylist }) => {
  const scrollContainerRef = useRef(null);
  const playlistScrollRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(true);
  const [showPlaylistScrollLeft, setShowPlaylistScrollLeft] = useState(false);
  const [showPlaylistScrollRight, setShowPlaylistScrollRight] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollTop(scrollTop > 200);
      setShowScrollBottom(scrollTop < scrollHeight - clientHeight - 200);
    }
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  const scrollUp = () => {
    scrollContainerRef.current?.scrollBy({
      top: -500,
      behavior: 'smooth'
    });
  };

  const scrollDown = () => {
    scrollContainerRef.current?.scrollBy({
      top: 500,
      behavior: 'smooth'
    });
  };

  const handlePlaylistScroll = () => {
    if (playlistScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = playlistScrollRef.current;
      setShowPlaylistScrollLeft(scrollLeft > 10);
      setShowPlaylistScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollPlaylistsLeft = () => {
    playlistScrollRef.current?.scrollBy({
      left: -600,
      behavior: 'smooth'
    });
  };

  const scrollPlaylistsRight = () => {
    playlistScrollRef.current?.scrollBy({
      left: 600,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const playlistContainer = playlistScrollRef.current;
    
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }
    
    if (playlistContainer) {
      playlistContainer.addEventListener('scroll', handlePlaylistScroll);
      handlePlaylistScroll(); // Initial check
    }
    
    return () => {
      container?.removeEventListener('scroll', handleScroll);
      playlistContainer?.removeEventListener('scroll', handlePlaylistScroll);
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-900 to-black relative" ref={scrollContainerRef}>
      <div className="p-8">
        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
            <span className="ml-3 text-gray-300">Loading...</span>
          </div>
        )}
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Good evening</h2>
          <p className="text-gray-400">
            {isAuthenticated 
              ? 'Cool down with your personalized playlists' 
              : 'Cool down with these playlists (Demo Mode - Login for full experience)'}
          </p>
        </div>

        {/* Community Songs Section - Always visible at top */}
        {uploadedSongs && uploadedSongs.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Music2 className="mr-2 h-6 w-6 text-cyan-400" />
              Community Songs
              <span className="ml-3 text-sm font-normal text-gray-400">
                {uploadedSongs.length} songs
              </span>
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {uploadedSongs.slice(0, 6).map((track) => (
                <div
                  key={track.id}
                  onClick={() => onTrackSelect(track)}
                  className="group bg-gray-800/40 hover:bg-gray-800/60 p-4 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="relative mb-4">
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      className="w-full aspect-square object-cover rounded-md shadow-xl"
                    />
                    <Button
                      size="icon"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full h-12 w-12 shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrackSelect(track);
                      }}
                    >
                      <Play className="h-6 w-6" fill="currentColor" />
                    </Button>
                  </div>
                  <h4 className="font-semibold text-white mb-1 truncate">{track.name}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {track.artists.map((a) => a.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Playlists Grid with Scroll Buttons */}
        <div className="mb-12 relative">
          <h3 className="text-2xl font-bold text-white mb-4">Featured Playlists</h3>
          
          {/* Scroll Buttons for Playlists */}
          {showPlaylistScrollLeft && (
            <Button
              onClick={scrollPlaylistsLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white rounded-full h-12 w-12 shadow-xl"
              size="icon"
            >
              <ChevronUp className="h-6 w-6 transform -rotate-90" />
            </Button>
          )}
          
          {showPlaylistScrollRight && (
            <Button
              onClick={scrollPlaylistsRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white rounded-full h-12 w-12 shadow-xl"
              size="icon"
            >
              <ChevronDown className="h-6 w-6 transform -rotate-90" />
            </Button>
          )}

          <div 
            ref={playlistScrollRef}
            className="grid grid-cols-3 gap-6 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {playlists.slice(0, 6).map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => onPlaylistSelect(playlist)}
                className="group bg-gray-800/40 hover:bg-gray-800/60 p-4 rounded-lg transition-all duration-300 cursor-pointer"
              >
                <div className="relative mb-4">
                  <img
                    src={playlist.images[0]?.url}
                    alt={playlist.name}
                    className="w-full aspect-square object-cover rounded-md shadow-xl"
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full h-12 w-12 shadow-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrackSelect(tracks[0]);
                    }}
                  >
                    <Play className="h-6 w-6" fill="currentColor" />
                  </Button>
                </div>
                <h4 className="font-semibold text-white mb-1 truncate">{playlist.name}</h4>
                <p className="text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Analysis Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-cyan-400" />
            Playlist Mood Analysis
          </h3>
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="mr-2 h-5 w-5 text-cyan-400" />
                {moodData.overall_mood}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {moodData.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300 flex items-center">
                      <Gauge className="mr-2 h-4 w-4 text-cyan-400" />
                      Energy Level
                    </span>
                    <span className="text-sm font-medium text-cyan-400">
                      {Math.round(moodData.energy * 100)}%
                    </span>
                  </div>
                  <Progress value={moodData.energy * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300 flex items-center">
                      <Music2 className="mr-2 h-4 w-4 text-cyan-400" />
                      Positivity
                    </span>
                    <span className="text-sm font-medium text-cyan-400">
                      {Math.round(moodData.valence * 100)}%
                    </span>
                  </div>
                  <Progress value={moodData.valence * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300 flex items-center">
                      <Activity className="mr-2 h-4 w-4 text-cyan-400" />
                      Danceability
                    </span>
                    <span className="text-sm font-medium text-cyan-400">
                      {Math.round(moodData.danceability * 100)}%
                    </span>
                  </div>
                  <Progress value={moodData.danceability * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Tempo</span>
                    <span className="text-sm font-medium text-cyan-400">
                      {moodData.tempo} BPM
                    </span>
                  </div>
                  <Progress value={(moodData.tempo / 200) * 100} className="h-2" />
                </div>
              </div>
              <div className="mt-6 p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-cyan-400">Mood Score:</span>{' '}
                  {moodData.mood_score}/10 - This playlist is perfect for cooling down and creating a relaxed atmosphere.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Removed duplicate section - Community Songs now shown at top */}

        {/* Tracks List */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            {isAuthenticated ? 'From Spotify' : 'Popular Tracks'}
          </h3>
          
          {/* Info about preview availability */}
          {isAuthenticated && tracks.length > 0 && (
            <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
              <p className="text-sm text-cyan-400">
                ℹ️ Some tracks may not have preview URLs available. Spotify only provides 30-second previews for certain tracks.
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => onTrackSelect(track)}
                className="group flex items-center p-3 rounded-lg hover:bg-gray-800/40 transition-all duration-200 cursor-pointer"
              >
                <span className="text-gray-400 w-8 text-center group-hover:hidden">
                  {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 hidden group-hover:flex text-cyan-400"
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                </Button>
                <img
                  src={track.album.images[0]?.url}
                  alt={track.name}
                  className="w-12 h-12 rounded ml-4 shadow-md"
                />
                <div className="ml-4 flex-1">
                  <p className="text-white font-medium">{track.name}</p>
                  <p className="text-sm text-gray-400">
                    {track.artists.map((a) => a.name).join(', ')}
                  </p>
                </div>
                <p className="text-gray-400 text-sm">{track.album.name}</p>
                <p className="text-gray-400 text-sm ml-8">
                  {Math.floor(track.duration_ms / 60000)}:
                  {Math.floor((track.duration_ms % 60000) / 1000)
                    .toString()
                    .padStart(2, '0')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Buttons */}
      <div className="fixed bottom-32 right-8 flex flex-col gap-2 z-50">
        {showScrollTop && (
          <Button
            onClick={scrollUp}
            className="bg-cyan-500 hover:bg-cyan-600 text-black rounded-full h-12 w-12 shadow-xl transition-all hover:scale-110"
            size="icon"
            title="Scroll Up"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        )}
        {showScrollBottom && (
          <Button
            onClick={scrollDown}
            className="bg-cyan-500 hover:bg-cyan-600 text-black rounded-full h-12 w-12 shadow-xl transition-all hover:scale-110"
            size="icon"
            title="Scroll Down"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MainContent;
