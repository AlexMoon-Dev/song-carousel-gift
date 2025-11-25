# Song Carousel Gift

A beautiful, interactive web app that displays songs in an infinite scrolling carousel. Perfect for gifting a personalized collection of meaningful songs.

## Features

- **Login Gate**: Simple authentication with hardcoded credentials (username: `admin`, password: `loveyou`)
- **Infinite Scrolling Carousel**: Songs displayed in multiple columns with alternating scroll directions
- **Interactive Song Cards**:
  - Displays album art/photos by default
  - On hover: shows note overlay with song details
  - Plays audio preview on hover
- **Add Songs**: Two methods to add songs:
  - Search Spotify API
  - Manual entry with custom photo URLs
- **Responsive Design**: Adapts from 1 column on mobile to 3-5 columns on desktop

## Project Structure

```
song-carousel-gift/
├── src/
│   ├── components/
│   │   ├── AddButton.jsx          # Floating + button
│   │   ├── AddSongModal.jsx       # Modal for adding songs
│   │   ├── CarouselColumn.jsx     # Individual scrolling column
│   │   ├── CarouselGrid.jsx       # Grid container for columns
│   │   ├── LoginGate.jsx          # Login screen
│   │   ├── MainView.jsx           # Main app view
│   │   └── SongBlock.jsx          # Individual song card
│   ├── services/
│   │   ├── supabase.js            # Supabase client & functions
│   │   └── spotify.js             # Spotify API integration
│   ├── styles/
│   │   ├── AddButton.css
│   │   ├── AddSongModal.css
│   │   ├── CarouselColumn.css
│   │   ├── CarouselGrid.css
│   │   ├── LoginGate.css
│   │   ├── MainView.css
│   │   └── SongBlock.css
│   ├── utils/
│   │   └── shuffle.js             # Array shuffling utility
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd song-carousel-gift
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Create a `songs` table with the following schema:

```sql
CREATE TABLE songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  artist TEXT NOT NULL,
  album_art TEXT,
  photo_url TEXT,
  preview_url TEXT,
  spotify_url TEXT,
  spotify_id TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Copy your Supabase URL and anon key from Project Settings > API

### 3. Set Up Spotify API (Optional)

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy your Client ID and Client Secret

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Fill in your credentials in `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. **Login**: Use username `admin` and password `loveyou`
2. **Add Songs**: Click the + button in the bottom-right corner
   - **Search Tab**: Search for songs on Spotify
   - **Manual Tab**: Manually enter song details
3. **View Songs**: Hover over any song card to see the note and hear a preview
4. **Enjoy**: Watch the infinite carousel scroll with your personalized collection!

## Component Details

### LoginGate
- Simple login form with hardcoded credentials
- Gradient background design
- Form validation

### MainView
- Fetches songs from Supabase on mount
- Handles loading and empty states
- Manages modal state for adding songs

### CarouselGrid
- Creates responsive column layout
- Shuffles songs for each column
- Passes scroll direction to columns

### CarouselColumn
- Implements infinite scroll with CSS animations
- Supports 'up' and 'down' scroll directions
- Duplicates song array for seamless looping
- Pauses on hover

### SongBlock
- Displays song image/album art
- Shows overlay on hover with note and song info
- Plays audio preview on hover
- Auto-pauses when hover ends

### AddSongModal
- Two-tab interface (Search/Manual)
- Spotify API integration for search
- Manual entry for custom songs
- Note field for personal messages

## Customization

### Change Login Credentials
Edit `src/components/LoginGate.jsx`:
```javascript
if (username === 'your_username' && password === 'your_password') {
  // ...
}
```

### Adjust Column Count
Edit `src/components/CarouselGrid.jsx`:
```javascript
const columnCount = window.innerWidth < 768 ? 1 : 4; // Change 4 to your desired count
```

### Modify Scroll Speed
Edit `src/styles/CarouselColumn.css`:
```css
.carousel-track {
  animation-duration: 40s; /* Adjust duration */
}
```

### Change Color Scheme
Update gradient colors in CSS files:
- Primary gradient: `#667eea` to `#764ba2`

## Technologies Used

- **React** with Vite
- **Supabase** for database
- **Spotify Web API** for song search
- **Axios** for HTTP requests
- **CSS3** animations for smooth scrolling

## License

MIT

## Notes

This is a personal gift project. The login credentials are intentionally simple as this is meant for sharing with a specific person rather than public deployment with full authentication.
