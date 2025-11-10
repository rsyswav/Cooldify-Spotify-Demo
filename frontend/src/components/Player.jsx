import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
} from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

const Player = ({ currentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (currentTrack.preview_url) {
        audioRef.current.src = currentTrack.preview_url;
        setDuration(currentTrack.duration_ms / 1000);
      } else {
        // No preview URL available
        audioRef.current.src = '';
        setDuration(currentTrack.duration_ms / 1000);
        setIsPlaying(false);
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (value) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="h-24 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 px-4 flex items-center justify-between">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Track Info */}
      <div className="flex items-center w-1/4">
        <img
          src={currentTrack.album.images[0]?.url}
          alt={currentTrack.name}
          className="w-14 h-14 rounded-md shadow-lg"
        />
        <div className="ml-3">
          <p className="text-sm font-medium text-white truncate max-w-[200px]">
            {currentTrack.name}
          </p>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">
            {currentTrack.artists.map((a) => a.name).join(', ')}
          </p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center w-2/4">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className={`hover:bg-gray-800 transition-all ${shuffle ? 'text-cyan-400' : 'text-gray-400'}`}
            onClick={() => setShuffle(!shuffle)}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="bg-white hover:bg-gray-200 text-black rounded-full h-10 w-10 transition-all hover:scale-105"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" fill="currentColor" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`hover:bg-gray-800 transition-all ${repeat ? 'text-cyan-400' : 'text-gray-400'}`}
            onClick={() => setRepeat(!repeat)}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-2xl">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-end w-1/4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
        <div className="w-24 ml-2">
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(val) => setVolume(val[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
