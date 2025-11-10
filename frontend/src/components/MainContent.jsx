import React from 'react';
import { Play, TrendingUp, Activity, Music2, Gauge } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

const MainContent = ({ playlists, onPlaylistSelect, onTrackSelect, tracks, moodData }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Good evening</h2>
          <p className="text-gray-400">Cool down with these playlists</p>
        </div>

        {/* Featured Playlists Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-4">Featured Playlists</h3>
          <div className="grid grid-cols-3 gap-6">
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

        {/* Tracks List */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Popular Tracks</h3>
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
    </div>
  );
};

export default MainContent;
