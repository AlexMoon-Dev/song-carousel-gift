// Search for a song on Deezer using JSONP (bypasses CORS)
export const searchDeezerSong = async (songName, artistName) => {
  return new Promise((resolve, reject) => {
    try {
      const query = encodeURIComponent(`${songName} ${artistName}`);
      const callbackName = `deezer_callback_${Date.now()}`;
      
      // Create callback function
      window[callbackName] = (data) => {
        // Cleanup
        delete window[callbackName];
        document.body.removeChild(script);
        
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
        document.body.removeChild(script);
        reject(new Error('Failed to load Deezer API'));
      };
      
      document.body.appendChild(script);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
          resolve(null);
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error searching Deezer:', error);
      resolve(null);
    }
  });
};