import axios from 'axios';

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'YOUR_SPOTIFY_CLIENT_ID';
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || 'YOUR_SPOTIFY_CLIENT_SECRET';
const SPOTIFY_REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;
const SPOTIFY_PLAYLIST_ID = import.meta.env.VITE_SPOTIFY_PLAYLIST_ID;

let accessToken = null;
let tokenExpiry = null;

// Get Spotify access token using Client Credentials (for search)
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

// Get user access token using refresh token (for playlist modifications)
const getUserAccessToken = async () => {
  if (!SPOTIFY_REFRESH_TOKEN) {
    console.error('No refresh token available');
    return null;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing user access token:', error);
    return null;
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

// Add track to playlist
export const addTrackToPlaylist = async (trackId) => {
  if (!SPOTIFY_PLAYLIST_ID) {
    console.warn('No playlist ID configured');
    return false;
  }

  if (!trackId) {
    console.warn('No track ID provided');
    return false;
  }

  try {
    const userToken = await getUserAccessToken();
    if (!userToken) {
      console.error('Could not get user access token');
      return false;
    }

    const trackUri = `spotify:track:${trackId}`;
    
    await axios.post(
      `https://api.spotify.com/v1/playlists/${SPOTIFY_PLAYLIST_ID}/tracks`,
      {
        uris: [trackUri],
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✓ Added track ${trackId} to playlist`);
    return true;
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    return false;
  }
};