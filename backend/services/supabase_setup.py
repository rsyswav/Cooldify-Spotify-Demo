"""
Supabase setup script - Run this once to create tables and storage bucket
"""
import os
from supabase import create_client, Client

def setup_supabase():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    
    supabase: Client = create_client(url, key)
    
    print("✅ Connected to Supabase")
    print(f"Project URL: {url}")
    
    print("\n📝 Please run the following SQL in your Supabase SQL Editor:")
    print("=" * 60)
    
    sql_script = """
-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration_ms INTEGER NOT NULL,
    audio_url TEXT NOT NULL,
    cover_image_url TEXT,
    genre TEXT,
    uploaded_by TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create playlists table  
CREATE TABLE IF NOT EXISTS playlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create playlist_songs junction table
CREATE TABLE IF NOT EXISTS playlist_songs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
    song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(playlist_id, song_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_songs_public ON songs(is_public);
CREATE INDEX IF NOT EXISTS idx_playlists_featured ON playlists(is_featured);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist ON playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_song ON playlist_songs(song_id);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to public songs" ON songs
    FOR SELECT USING (is_public = true);

CREATE POLICY "Allow public read access to playlists" ON playlists
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to playlist songs" ON playlist_songs
    FOR SELECT USING (true);

-- Create policies for authenticated insert
CREATE POLICY "Allow authenticated users to insert songs" ON songs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert playlists" ON playlists
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to add songs to playlists" ON playlist_songs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
"""
    
    print(sql_script)
    print("=" * 60)
    
    print("\n🪣 Storage Bucket Setup:")
    print("Go to Supabase Dashboard → Storage → Create a new bucket named 'audio-files'")
    print("Set it to PUBLIC so files can be accessed")
    print("\nOr run this in SQL Editor:")
    print("INSERT INTO storage.buckets (id, name, public) VALUES ('audio-files', 'audio-files', true);")
    
    return True

if __name__ == "__main__":
    from dotenv import load_dotenv
    from pathlib import Path
    
    ROOT_DIR = Path(__file__).parent.parent
    load_dotenv(ROOT_DIR / '.env')
    
    setup_supabase()
