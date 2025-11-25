// Detect if we're in production (Vercel) or development (localhost)
const isProduction = import.meta.env.PROD;

// Search using JSONP (for localhost - no CSP restrictions)
const searchDeezerJSONP = async (songName, artistName) => {
  return new Promise((resolve) => {
    try {
      const query = encodeURIComponent(`${songName} ${artistName}`);
      const callbackName = `deezer_callback_${Date.now()}`;
      
      // Create callback function
      window[callbackName] = (data) => {
        // Cleanup
        delete window[callbackName];
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        
        if (data.data && data.data.length > 0) {
          const track = data.data[0];
          resolve({
            previewUrl: track.preview || null,
            deezerUrl: track.link,
          });
        } else {
          resolve(null);
        }
      };
      
      // Create script tag for JSONP
      const script = document.createElement('script');
      script.src = `https://api.deezer.com/search?q=${query}&limit=1&output=jsonp&callback=${callbackName}`;
      script.onerror = () => {
        delete window[callbackName];
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        console.warn('JSONP failed, Deezer unavailable');
        resolve(null);
      };
      
      document.body.appendChild(script);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
          resolve(null);
        }
      }, 5000);
      
    } catch (error) {
      console.warn('Error with JSONP:', error);
      resolve(null);
    }
  });
};

// Search using serverless proxy (for production - bypasses CSP)
const searchDeezerProxy = async (songName, artistName) => {
  try {
    const response = await fetch(
      `/api/deezer-search?song=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artistName)}`
    );

    if (!response.ok) {
      console.warn('Deezer proxy request failed');
      return null;
    }

    const data = await response.json();
    return data.previewUrl ? {
      previewUrl: data.previewUrl,
      deezerUrl: data.deezerUrl,
    } : null;
  } catch (error) {
    console.warn('Error with Deezer proxy:', error);
    return null;
  }
};

// Main search function - automatically picks the right method
export const searchDeezerSong = async (songName, artistName) => {
  if (isProduction) {
    // Use serverless proxy on Vercel
    return searchDeezerProxy(songName, artistName);
  } else {
    // Use JSONP on localhost
    return searchDeezerJSONP(songName, artistName);
  }
};