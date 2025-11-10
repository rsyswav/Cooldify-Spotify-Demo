import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseService = {
  async getAllSongs() {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching songs:', error);
      return [];
    }
    
    return data;
  },

  async uploadSong(file, metadata) {
    // This is handled by the backend API
    // Just here for reference
  }
};
