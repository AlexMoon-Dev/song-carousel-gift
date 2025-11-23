import { useState, useRef, useEffect } from 'react';
import { searchDeezerSong } from '../services/deezer';
import '../styles/SongBlock.css';

const SongBlock = ({ song }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [audioUrl, setAudioUrl] = useState(song.preview_url);
  const audioRef = useRef(null);

  // Fetch Deezer preview if needed
  useEffect(() => {
    const fetchDeezerPreview = async () => {
      // If we don't have a preview URL and we're hovered, try to get one from Deezer
      if (isHovered && !audioUrl && song.name && song.artist) {
        try {
          const deezerResult = await searchDeezerSong(song.name, song.artist);
          if (deezerResult && deezerResult.previewUrl) {
            setAudioUrl(deezerResult.previewUrl);
          }
        } catch (error) {
          console.error('Error fetching Deezer preview:', error);
        }
      }
    };

    fetchDeezerPreview();
  }, [isHovered, audioUrl, song.name, song.artist]);

  useEffect(() => {
    if (isHovered && audioRef.current && audioUrl) {
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error);
      });
    } else if (!isHovered && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isHovered, audioUrl]);

  return (
    <div
      className="song-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={song.photo_url || '/placeholder.png'}
        alt={song.name}
        className="song-image"
      />
      {isHovered && (
        <div className="song-overlay">
          <div className="song-note">{song.note || 'No note available'}</div>
          <div className="song-info">
            <img
              src={song.album_art || '/placeholder.png'}
              alt={song.name}
              className="song-image" 
              style={{ width: '60px', height: '60px' }}
            />
            <div style={{padding: '7px', paddingLeft: '20px'}}>
              <div className="song-name">{song.name}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
          </div>
        </div>
      )}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}
    </div>
  );
};

export default SongBlock;