import { useState, useRef, useEffect } from 'react';
import '../styles/SongBlock.css';

const SongBlock = ({ song }) => {
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isHovered && audioRef.current && song.preview_url) {
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error);
      });
    } else if (!isHovered && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isHovered, song.preview_url]);

  return (
    <div
      className="song-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Default: Show custom photo */}
      <img
        src={song.photo_url || '/placeholder.png'}
        alt={song.name}
        className="song-image"
      />
      {isHovered && (
        <div className="song-overlay">
          <div className="song-note">{song.note || 'No note available'}</div>
          <div className="song-info">
            {/* Hovered: Show album art */}
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
      {song.preview_url && (
        <audio ref={audioRef} src={song.preview_url} preload="metadata" />
      )}
    </div>
  );
};

export default SongBlock;