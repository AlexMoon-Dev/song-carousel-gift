import axios from 'axios';

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'YOUR_SPOTIFY_CLIENT_ID';
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || 'YOUR_SPOTIFY_CLIENT_SECRET';

let accessToken = null;
let tokenExpiry = null;

// Get Spotify access token
const getAccessToken = async () => {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
};

// Search for songs on Spotify
export const searchSpotifySongs = async (query) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit: 10,
      },
    });

    return response.data.tracks.items.map((track) => ({
      spotifyId: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      albumArt: track.album.images[0]?.url || '',
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify,
    }));
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return [];
  }
};
