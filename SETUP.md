# Quick Setup Guide

## Database Schema

Run this SQL in your Supabase SQL Editor to create the songs table:

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

-- Enable Row Level Security (optional, for production)
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for development)
-- For production, you'll want more restrictive policies
CREATE POLICY "Enable all operations for authenticated users" ON songs
  FOR ALL
  USING (true);
```

## Environment Setup

1. Copy the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials in `.env`:
   - Get Supabase credentials from: https://app.supabase.com/project/YOUR_PROJECT/settings/api
   - Get Spotify credentials from: https://developer.spotify.com/dashboard

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

## Login Credentials

- **Username**: admin
- **Password**: loveyou

## Database Field Mappings

When adding songs, these fields are stored:

| Field | Source | Required |
|-------|--------|----------|
| `name` | Song name | Yes |
| `artist` | Artist name | Yes |
| `album_art` | Spotify album cover or manual URL | No |
| `photo_url` | Custom photo URL | No |
| `preview_url` | Spotify preview URL (30s) | No |
| `spotify_url` | Link to song on Spotify | No |
| `spotify_id` | Spotify track ID | No |
| `note` | Personal message/note | No |

## Customization Tips

### 1. Change Number of Columns
File: `src/components/CarouselGrid.jsx`
```javascript
const columnCount = window.innerWidth < 768 ? 1 : 4; // Change 4 to 3 or 5
```

### 2. Adjust Scroll Speed
File: `src/styles/CarouselColumn.css`
```css
.carousel-track {
  animation-duration: 40s; /* Lower = faster, Higher = slower */
}
```

### 3. Change Colors
Primary gradient used throughout:
- Color 1: `#667eea` (purple-blue)
- Color 2: `#764ba2` (purple)

Files to update:
- `src/styles/LoginGate.css`
- `src/styles/AddButton.css`
- `src/styles/AddSongModal.css`

### 4. Modify Login Credentials
File: `src/components/LoginGate.jsx` (line 12)
```javascript
if (username === 'admin' && password === 'loveyou') {
```

## Troubleshooting

### Songs not loading
- Check Supabase credentials in `.env`
- Verify the `songs` table exists in your database
- Check browser console for errors

### Spotify search not working
- Verify Spotify credentials in `.env`
- Check that you've created an app in Spotify Developer Dashboard
- Note: Spotify preview URLs may not be available for all songs

### Audio not playing
- Some songs don't have preview URLs from Spotify
- Check browser console for audio playback errors
- Try manually adding a song with a direct MP3 URL

### Responsive layout issues
- Carousel is optimized for desktop (3-5 columns)
- Mobile shows 1 column
- Breakpoint is at 768px (can be adjusted in CarouselGrid.jsx)
