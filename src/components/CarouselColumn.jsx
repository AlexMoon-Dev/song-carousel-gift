import SongBlock from './SongBlock';
import '../styles/CarouselColumn.css';

const CarouselColumn = ({ songs, scrollDirection = 'down' }) => {
  // Duplicate the array for seamless looping
  const duplicatedSongs = [...songs, ...songs];

  return (
    <div className={`carousel-column ${scrollDirection}`}>
      <div className="carousel-track">
        {duplicatedSongs.map((song, index) => (
          <SongBlock key={`${song.id}-${index}`} song={song} />
        ))}
      </div>
    </div>
  );
};

export default CarouselColumn;
