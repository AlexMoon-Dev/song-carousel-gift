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
          <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2QqleVPTKCpL0Z0qq5U3ZW?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

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
