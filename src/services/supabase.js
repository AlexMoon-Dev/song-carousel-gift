import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all songs from Supabase
export const fetchSongs = async () => {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
};

// Add a new song to Supabase
export const addSong = async (songData) => {
  try {
    const { data, error } = await supabase
      .from('songs')
      .insert([songData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error adding song:', error);
    throw error;
  }
};

// Upload a file to Supabase Storage
export const uploadFile = async (file, bucket) => {
  try {
    // Generate unique filename with timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = fileName;

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL lol
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};