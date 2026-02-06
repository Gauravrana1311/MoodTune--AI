## 🎵 MoodTune--AI (Mood-Based Song Remix & Recommendation System)
```
An AI-powered full-stack web application that analyzes the **mood of an uploaded song**, recommends **similar tracks from Spotify**, and generates a **mood-based remix** of the audio.

This project combines **audio signal processing, machine learning concepts, and modern web development** to deliver an interactive music experience.
```

### 🚀 Features
```
- 🎧 Detects song mood: **Happy, Sad, Energetic, Calm**
- 📊 Extracts audio features such as **tempo, energy, valence**
- 🎶 Recommends ~20 mood-matched songs using **Spotify Web API**
- ▶️ 30-second previews with **Open in Spotify** links
- 🎛 Generates a **mood-based remix** (tempo & volume modification)
- 💻 Responsive and modern **React** user interface
- 📥 Downloadable remixed audio
```

### 🧠 How It Works
```
1. User uploads an audio file  
2. Backend extracts audio features using **Librosa**
3. Mood is inferred from extracted features
4. Spotify API fetches similar mood-based songs
5. **Pydub** modifies audio to create a remix
6. Frontend displays mood, features, recommendations, and remix options
```

### 🛠 Tech Stack
```
# Backend
- Python  
- Flask  
- Librosa (audio feature extraction)  
- Pydub (audio remixing)  
- Spotipy (Spotify Web API)

# Frontend
- React  
- JavaScript  
- CSS (custom styling & animations)

# Other
- Node.js & npm  
- Spotify Developer API  
```

### 📦 Installation & Setup
```
## 1️⃣ Clone the Repository
```git clone https://github.com/Gauravrana1311/MoodTune--AI.git```
```cd MoodTune--AI```

## 2️⃣ Backend Setup
```cd backend```
```python -m venv venv```

## Windows
```venv\Scripts\activate```

## macOS / Linux
```source venv/bin/activate```

##Install dependencies:
```pip install -r requirements.txt```
mkdir uploads

Create backend/.env:
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5000/callback
SECRET_KEY=your_secret_key

##Run backend:
```python app.py```

3️⃣ Frontend Setup
``cd frontend_project``
```npm install```
```npm start```

```

###🧪 Installation & Setup
```
Open the app in your browser.
Upload an audio file (mp3/wav/ogg/flac/m4a).
Click Analyze Mood to see mood + audio features.
Explore Recommended Playlist and use Preview / Spotify buttons.
Click Create Mood-Based Remix and then Download Remix.
```

👨‍💻 Author
```
Gaurav Singh Rana
GiThub -- ```https://github.com/Gauravrana1311```
```
