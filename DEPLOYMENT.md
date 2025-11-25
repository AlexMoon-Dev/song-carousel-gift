# Song Carousel Gift - Deployment Guide

## ✅ What's Working

All features are implemented and functional:

- ✅ **Login System**: Hardcoded credentials from .env
- ✅ **Vertical Carousel**: 3-5 columns (desktop), 1 column (mobile), alternating scroll directions
- ✅ **Hover Effect**: Black overlay (60-80% opacity) with note, album art, song info
- ✅ **Audio Playback**: Plays preview on hover (Spotify primary, Deezer fallback)
- ✅ **Add Button**: Bottom-right floating button
- ✅ **Search & Upload**: Spotify search + photo upload + note entry
- ✅ **Spotify Playlist**: Auto-adds songs to your playlist
- ✅ **Database**: Supabase for data + file storage

## 🚀 How to Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free)
- Your .env file with all credentials

### Step 1: Push to GitHub

```bash
cd song-carousel-rebuilt
git init
git add .
git commit -m "Initial commit - working version"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/song-carousel-gift.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **DO NOT CHANGE ANY BUILD SETTINGS** - Vercel auto-detects Vite
5. Click "Deploy"

### Step 3: Add Environment Variables

Go to Vercel → Your Project → Settings → Environment Variables

Add ALL variables from your `.env` file:

```
VITE_SUPABASE_URL=https://ibixxgijpzhqvnzvxuzl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SPOTIFY_CLIENT_ID=4f595802a5a5456f87bf409f0fbbb8f7
VITE_SPOTIFY_CLIENT_SECRET=47e733e2bf184ada8698919ff394f7ce
VITE_AlexUser=AlexMGB
VITE_VictoriaUser=VicReyOro
VITE_password=31072025
VITE_SPOTIFY_REFRESH_TOKEN=AQBKXkAK0w2Jo-eZKyCV...
VITE_SPOTIFY_PLAYLIST_ID=2QqleVPTKCpL0Z0qq5U3ZW
```

**Important**: Apply to all environments (Production, Preview, Development)

### Step 4: Redeploy

After adding environment variables:
1. Go to Deployments tab
2. Click "..." menu on latest deployment
3. Click "Redeploy"

Your app will be live at: `https://your-project-name.vercel.app`

## 🎵 How Audio Works

### Localhost (Development)
- Uses **JSONP** to call Deezer API directly
- No CSP restrictions
- Audio plays instantly

### Production (Vercel)
- Uses **serverless proxy** (`/api/deezer-search`)
- Bypasses CSP restrictions
- Automatic fallback if Spotify has no preview

### Audio Priority
1. **Spotify preview URL** (stored in database)
2. **Deezer preview** (fetched on-demand via proxy)
3. **No audio** (song still displays, just no preview)

## 📁 Project Structure

```
song-carousel-rebuilt/
├── api/                          # Serverless functions (Vercel)
│   └── deezer-search.js         # Deezer API proxy
├── src/
│   ├── components/
│   │   ├── AddButton.jsx        # Floating add button
│   │   ├── AddSongModal.jsx     # Song search & upload
│   │   ├── CarouselColumn.jsx   # Single carousel column
│   │   ├── CarouselGrid.jsx     # Grid of columns
│   │   ├── LoginGate.jsx        # Login screen
│   │   ├── MainView.jsx         # Main app view
│   │   └── SongBlock.jsx        # Individual song card
│   ├── services/
│   │   ├── deezer.js            # Deezer integration (hybrid)
│   │   ├── spotify.js           # Spotify search + playlist
│   │   └── supabase.js          # Database + storage
│   ├── styles/                   # CSS modules
│   ├── utils/
│   │   └── shuffle.js           # Fisher-Yates shuffle
│   ├── App.jsx                   # Root component
│   └── main.jsx                  # Entry point
├── .env                          # Environment variables
└── package.json
```

## 🐛 Troubleshooting

### Audio not playing on Vercel?
- Check browser console for errors
- Verify `/api/deezer-search` returns 200 (not 404)
- Test the serverless function: `https://your-app.vercel.app/api/deezer-search?song=test&artist=test`

### Playlist not updating?
- Verify `VITE_SPOTIFY_REFRESH_TOKEN` is correct
- Check `VITE_SPOTIFY_PLAYLIST_ID` doesn't have query parameters
- Look for console errors: "Error adding track to playlist"

### Images not loading?
- Check Supabase Storage policies allow public access
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Login not working?
- Ensure all env variables have `VITE_` prefix
- Check username/password match .env values exactly

## 🔧 Local Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`

## 🎉 Features Breakdown

### 1. Login System
- File: `src/components/LoginGate.jsx`
- Credentials: Hardcoded in `.env`
- Users: AlexMGB, VicReyOro
- Password: 31072025

### 2. Carousel Display
- Files: `CarouselGrid.jsx`, `CarouselColumn.jsx`
- Responsive: 3-5 columns (desktop), 1 column (mobile)
- Animation: Infinite scroll with alternating directions
- Songs: Shuffled once, same order in all columns

### 3. Song Hover
- File: `SongBlock.jsx`
- Overlay: 70% opacity black background
- Content: Note + album art + song name + artist
- Audio: Plays 30-second preview on hover

### 4. Add Song
- File: `AddSongModal.jsx`
- Two tabs: Spotify search OR manual entry
- Required: Song selection, photo upload
- Optional: Note (recommended)
- Backend: Supabase database + storage

### 5. Spotify Integration
- File: `src/services/spotify.js`
- Search: Client Credentials flow
- Playlist: Authorization Code flow with refresh token
- Auto-add: Every song (with spotify_id) added to playlist

### 6. Database Schema
```sql
songs (
  id: UUID (primary key),
  name: TEXT,
  artist: TEXT,
  note: TEXT,
  photo_url: TEXT,
  album_art: TEXT,
  preview_url: TEXT,
  spotify_url: TEXT,
  spotify_id: TEXT,
  created_at: TIMESTAMP
)
```

## 📝 Notes

- Audio previews are 30 seconds (Spotify/Deezer limitation)
- Deezer URLs expire, fetched on-demand per hover
- RLS disabled for development (re-enable for production security)
- All API keys should be kept secret (don't commit .env)

## 💡 Future Enhancements

- [ ] Enable Supabase RLS with proper policies
- [ ] Add edit/delete song functionality
- [ ] Multiple playlist support
- [ ] Custom album art upload option
- [ ] Volume control for audio
- [ ] Dark/light theme toggle

---

**Made with ❤️ for Victoria**
