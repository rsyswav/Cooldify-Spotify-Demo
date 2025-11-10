// Mock data for Cooldify - Spotify Clone

export const mockPlaylists = [
  {
    id: '1',
    name: 'Chill Vibes',
    description: 'Perfect playlist to cool down and relax',
    images: [{ url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=300&h=300&fit=crop' }],
    tracks: { total: 50 },
    owner: { display_name: 'Cooldify' }
  },
  {
    id: '2',
    name: 'Focus Flow',
    description: 'Stay focused with these cool beats',
    images: [{ url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop' }],
    tracks: { total: 45 },
    owner: { display_name: 'Cooldify' }
  },
  {
    id: '3',
    name: 'Midnight Drive',
    description: 'Cool tracks for late night drives',
    images: [{ url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' }],
    tracks: { total: 38 },
    owner: { display_name: 'Cooldify' }
  },
  {
    id: '4',
    name: 'Ocean Breeze',
    description: 'Feel the cool ocean vibes',
    images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }],
    tracks: { total: 42 },
    owner: { display_name: 'Cooldify' }
  },
  {
    id: '5',
    name: 'Study Session',
    description: 'Keep your cool while studying',
    images: [{ url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=300&h=300&fit=crop' }],
    tracks: { total: 55 },
    owner: { display_name: 'Cooldify' }
  },
  {
    id: '6',
    name: 'Summer Cool Down',
    description: 'Beat the heat with these tracks',
    images: [{ url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' }],
    tracks: { total: 40 },
    owner: { display_name: 'Cooldify' }
  }
];

export const mockTracks = [
  {
    id: 't1',
    name: 'Cool Breeze',
    artists: [{ name: 'The Chillsters' }],
    album: {
      name: 'Chill Vibes Vol. 1',
      images: [{ url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=300&h=300&fit=crop' }]
    },
    duration_ms: 234000,
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 't2',
    name: 'Midnight Flow',
    artists: [{ name: 'DJ Frost' }],
    album: {
      name: 'Night Sessions',
      images: [{ url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop' }]
    },
    duration_ms: 198000,
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 't3',
    name: 'Ocean Waves',
    artists: [{ name: 'Aqua Beats' }],
    album: {
      name: 'Deep Blue',
      images: [{ url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' }]
    },
    duration_ms: 267000,
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 't4',
    name: 'Ice Cold',
    artists: [{ name: 'The Freezers' }],
    album: {
      name: 'Winter Vibes',
      images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }]
    },
    duration_ms: 212000,
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 't5',
    name: 'Crystal Clear',
    artists: [{ name: 'Clear Sky' }],
    album: {
      name: 'Pure',
      images: [{ url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=300&h=300&fit=crop' }]
    },
    duration_ms: 245000,
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  }
];

export const mockMoodData = {
  overall_mood: 'Relaxed & Cool',
  mood_score: 7.2,
  energy: 0.45,
  valence: 0.68,
  tempo: 95,
  danceability: 0.55,
  description: 'This playlist creates a calm and cool atmosphere perfect for unwinding. The moderate tempo and positive vibes help reduce stress and create a peaceful environment.'
};

export const mockCurrentTrack = mockTracks[0];
