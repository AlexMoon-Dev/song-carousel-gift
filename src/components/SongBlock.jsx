import { useState, useRef, useEffect } from 'react';
import '../styles/SongBlock.css';

const SongBlock = ({ song }) => {
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isHovered && audioRef.current && song.previewUrl) {
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error);
      });
    } else if (!isHovered && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isHovered, song.previewUrl]);

  return (
    <div
      className="song-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={song.photoUrl || song.albumArt || '/placeholder.png'}
        alt={song.name}
        className="song-image"
      />
      {isHovered && (
        <div className="song-overlay">
          <div className="song-note">{song.note || 'No note available'}</div>
          <div className="song-info">
            <div className="song-name">{song.name}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
        </div>
      )}
      {song.previewUrl && (
        <audio ref={audioRef} src={song.previewUrl} preload="metadata" />
      )}
    </div>
  );
};

export default SongBlock;
