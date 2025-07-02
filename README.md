# Echodune Music Waves

A full-stack Spotify-like music streaming app with collaborative playlists, robust playback, and a modern UI.

---

## Features
- Global audio playback with MiniPlayer
- User authentication (JWT, Google OAuth)
- Liked songs, playlists, and collaborative playlists
- Add/remove songs, invite collaborators by email
- Real-time UI sync, search, and more

---

## Prerequisites
- **Python 3.9+** (for backend)
- **Node.js 18+ & npm** (for frontend)
- **Git** (to clone the repo)

---

## Directory Structure
```
/echodune-music-waves
  /echodune         # Django backend
  /src              # React frontend
  /public           # Static assets
  ...
```

---

## Backend Setup (Django)

1. **Navigate to the backend directory:**
   ```sh
   cd echodune
   ```

2. **Create and activate a virtual environment:**
   ```sh
   python3 -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Create a `.env` file in `echodune/` with the following (edit as needed):**
   ```env
   DJANGO_SECRET_KEY=your-secret-key-here
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   # Add any other secrets as needed
   ```

5. **Apply migrations:**
   ```sh
   python manage.py migrate
   ```

6. **Create a superuser (optional, for admin):**
   ```sh
   python manage.py createsuperuser
   ```

7. **Run the backend server:**
   ```sh
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/`

---

## Frontend Setup (React)

1. **Navigate to the frontend directory:**
   ```sh
   cd ../src
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **(Optional) Create a `.env` file for frontend config:**
   - If you need to override API endpoints, create `.env` and set `VITE_API_BASE_URL`.

4. **Run the frontend dev server:**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:8080/`

---

## Usage
- Register or log in with your account (or Google OAuth)
- Browse, search, and play songs
- Create playlists, like songs, and manage your library
- Invite collaborators to playlists by email
- Collaborators can add/remove songs and see shared playlists
- Enjoy a seamless, Spotify-like experience!

---

## Developer Credits

**Developed by Ritesh and Sanath**
