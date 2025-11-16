import { useMemo } from 'react';
import CarouselColumn from './CarouselColumn';
import { shuffleArray } from '../utils/shuffle';
import '../styles/CarouselGrid.css';

const CarouselGrid = ({ songs }) => {
  // Determine number of columns based on screen size
  // Desktop: 3-5 columns, Mobile: 1 column
  const columnCount = window.innerWidth < 768 ? 1 : 4;

  // Create shuffled arrays for each column
  const columns = useMemo(() => {
    const cols = [];
    for (let i = 0; i < columnCount; i++) {
      cols.push(shuffleArray(songs));
    }
    return cols;
  }, [songs, columnCount]);

  return (
    <div className="carousel-grid">
      {columns.map((columnSongs, index) => (
        <CarouselColumn
          key={index}
          songs={columnSongs}
          scrollDirection={index % 2 === 0 ? 'down' : 'up'}
        />
      ))}
    </div>
  );
};

export default CarouselGrid;
