import { useState } from 'react';
import { searchSpotifySongs } from '../services/spotify';
import { addSong, uploadFile } from '../services/supabase';
import '../styles/AddSongModal.css';

const AddSongModal = ({ isOpen, onClose, onSongAdded }) => {
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'manual'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [note, setNote] = useState('');
  
  // Photo upload state (for both tabs)
  const [photoFile, setPhotoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Manual entry fields
  const [manualName, setManualName] = useState('');
  const [manualArtist, setManualArtist] = useState('');
  const [manualNote, setManualNote] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const results = await searchSpotifySongs(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectSong = (song) => {
    setSelectedSong(song);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleSubmitSearch = async () => {
    if (!selectedSong) {
      alert('Please select a song');
      return;
    }

    if (!photoFile) {
      alert('Please upload a photo of you two');
      return;
    }

    setIsUploading(true);
    try {
      // Upload photo to Supabase Storage
      const photoUrl = await uploadFile(photoFile, 'song-images');

      const songData = {
        name: selectedSong.name,
        artist: selectedSong.artist,
        album_art: selectedSong.albumArt,
        preview_url: selectedSong.previewUrl,
        spotify_url: selectedSong.spotifyUrl,
        spotify_id: selectedSong.spotifyId,
        note: note,
        photo_url: photoUrl, // Custom uploaded photo
      };

      await addSong(songData);
      onSongAdded();
      resetModal();
      onClose();
    } catch (error) {
      console.error('Error adding song:', error);
      alert('Failed to add song. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitManual = async () => {
    if (!manualName.trim() || !manualArtist.trim()) {
      alert('Please fill in at least the song name and artist.');
      return;
    }

    if (!photoFile) {
      alert('Please upload a photo');
      return;
    }

    setIsUploading(true);
    try {
      // Upload photo to Supabase Storage
      const photoUrl = await uploadFile(photoFile, 'song-images');

      const songData = {
        name: manualName,
        artist: manualArtist,
        photo_url: photoUrl,
        note: manualNote,
        album_art: null,
        preview_url: null,
        spotify_url: null,
        spotify_id: null,
      };

      await addSong(songData);
      onSongAdded();
      resetModal();
      onClose();
    } catch (error) {
      console.error('Error adding song:', error);
      alert('Failed to add song. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedSong(null);
    setNote('');
    setPhotoFile(null);
    setManualName('');
    setManualArtist('');
    setManualNote('');
    setActiveTab('search');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add a Song</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search Spotify
          </button>
          <button
            className={`tab ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Entry
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'search' ? (
            <div className="search-tab">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search for a song..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((song) => (
                    <div
                      key={song.spotifyId}
                      className={`search-result-item ${
                        selectedSong?.spotifyId === song.spotifyId ? 'selected' : ''
                      }`}
                      onClick={() => handleSelectSong(song)}
                    >
                      <img src={song.albumArt} alt={song.name} />
                      <div className="result-info">
                        <div className="result-name">{song.name}</div>
                        <div className="result-artist">{song.artist}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedSong && (
                <div className="note-section">
                  <label htmlFor="photo-upload">Upload a photo of you two *</label>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  {photoFile && <p className="file-selected">✓ {photoFile.name}</p>}

                  <label htmlFor="note">Add a note:</label>
                  <textarea
                    id="note"
                    placeholder="Why is this song special?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows="4"
                  />
                  <button 
                    className="submit-button" 
                    onClick={handleSubmitSearch}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Add Song'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="manual-tab">
              <div className="form-group">
                <label htmlFor="manual-name">Song Name *</label>
                <input
                  type="text"
                  id="manual-name"
                  placeholder="Enter song name"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="manual-artist">Artist *</label>
                <input
                  type="text"
                  id="manual-artist"
                  placeholder="Enter artist name"
                  value={manualArtist}
                  onChange={(e) => setManualArtist(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="manual-photo-upload">Upload a photo *</label>
                <input
                  type="file"
                  id="manual-photo-upload"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  required
                />
                {photoFile && <p className="file-selected">✓ {photoFile.name}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="manual-note">Note</label>
                <textarea
                  id="manual-note"
                  placeholder="Why is this song special?"
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  rows="4"
                />
              </div>

              <button 
                className="submit-button" 
                onClick={handleSubmitManual}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Add Song'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSongModal;