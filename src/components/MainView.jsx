import { useState, useEffect } from 'react';
import { fetchSongs } from '../services/supabase';
import CarouselGrid from './CarouselGrid';
import AddButton from './AddButton';
import AddSongModal from './AddSongModal';
import '../styles/MainView.css';

const MainView = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSongs = async () => {
    setIsLoading(true);
    const fetchedSongs = await fetchSongs();
    setSongs(fetchedSongs);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const handleSongAdded = () => {
    loadSongs();
  };

  if (isLoading) {
    return (
      <div className="main-view">
        <div className="loading">Loading songs...</div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="main-view">
        <div className="empty-state">
          <h2>No songs yet!</h2>
          <p>Click the + button to add your first song.</p>
        </div>
        <AddButton onClick={() => setIsModalOpen(true)} />
        <AddSongModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSongAdded={handleSongAdded}
        />
      </div>
    );
  }

  return (
    <div className="main-view">

      <CarouselGrid songs={songs} />
      <AddButton onClick={() => setIsModalOpen(true)} />
      <AddSongModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSongAdded={handleSongAdded}
      />
    </div>
  );
};

export default MainView;
