// Serverless function to proxy Deezer API requests
// This bypasses CSP restrictions on Vercel
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { song, artist } = req.query;

  if (!song || !artist) {
    return res.status(400).json({ error: 'Missing song or artist parameter' });
  }

  try {
    const query = encodeURIComponent(`${song} ${artist}`);
    const response = await fetch(`https://api.deezer.com/search?q=${query}&limit=1`);
    
    if (!response.ok) {
      throw new Error(`Deezer API returned ${response.status}`);
    }
    
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const track = data.data[0];
      return res.status(200).json({
        previewUrl: track.preview || null,
        deezerUrl: track.link,
        title: track.title,
        artist: track.artist?.name,
      });
    }

    return res.status(200).json({ previewUrl: null, deezerUrl: null });
  } catch (error) {
    console.error('Error fetching from Deezer:', error);
    return res.status(500).json({ error: 'Failed to fetch from Deezer' });
  }
}
