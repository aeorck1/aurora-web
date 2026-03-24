# Aura 🌸

# Link to the live site [https://Aura-web-livid.vercel.app]
# Link to the backend repository [https://github.com/aeorck1/AIurora-backend]


> *A calmer mind begins here.*

Aura is a private, AI-powered mental wellness companion. It gives users a safe, judgment-free space to talk through their feelings, reflect on their day, and track their emotional wellbeing — all from the browser.

Built for the **#RaenestHackathon** by **Godwin Daniel** for **RaenestXDevCareers**.

---

## ✨ Features

| Feature | Description |
|---|---|
| **AI Therapy Chat** | Conversational AI that listens and responds thoughtfully to help users process their emotions |
| **Voice Input** | Record voice messages; browser-native transcription (Web Speech API) streams text in real time as you speak |
| **Audio Upload** | Raw audio is sent directly to the backend via `POST /api/chat/audio` for server-side processing |
| **Private Journal** | Personal journal stored exclusively in `localStorage` — entries never leave the device |
| **Mood Tracking** | Tag each journal entry with a mood to observe emotional patterns over time |
| **Session Memory** | Aura maintains context throughout a session for continuity |
| **Light / Dark Theme** | One-click theme toggle, respects the user's preference |
| **Data Ownership** | Export journal as `.txt` or permanently delete all data at any time |

---

## 🖥️ Pages

- **Landing** — Hero introduction, feature overview, and privacy commitment
- **Chat** — Full AI conversation interface with voice and text input
- **Journal** — Write, edit, search, tag, and export personal journal entries

---

## 🏗️ Architecture

The project follows a clean, production-grade React + Vite architecture with clear separation of concerns:

```
src/
├── components/     # Reusable UI components (ChatBubble, ChatInput, JournalCard, MoodTag…)
├── pages/          # Route-level pages (LandingPage, ChatPage, JournalPage)
├── layouts/        # Shared layout wrappers (NavBar, SiteFooter)
├── services/       # API layer — all backend calls live here (api.js)
├── store/          # Global state via React Context (AuraContext)
├── hooks/          # Custom hooks (useSpeechToText, useAudioRecorder)
├── utils/          # Helper functions (storage.js)
├── constants/      # Static values (moods list, config)
└── styles/         # CSS Modules, per-component and per-page
```

---

## 🔌 API Endpoints

All backend calls are centralised in `src/services/api.js`.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/users` | Create a new anonymous user session |
| `GET` | `/api/chat/:user_id` | Load a user's full chat history |
| `POST` | `/api/chat` | Send a text message and receive Aura's response |
| `POST` | `/api/chat/audio` | Upload a voice recording (`multipart/form-data`: `user_id`, `audio_file`) |

**Backend:** `https://aiurora-backend-production.up.railway.app`

---

## 🔒 Privacy

- **Journal entries** are stored in browser `localStorage` only and never transmitted to any server.
- **Chat sessions** are tied to an anonymous session ID — no personally identifiable information is collected.
- Users can **delete all data** at any time from the Journal settings panel.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | CSS Modules (Vanilla CSS) |
| State | React Context API |
| Voice Input | Web Speech API + MediaRecorder API |
| Storage | Browser `localStorage` |
| Backend | REST API (Railway) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 👤 Credits

Developed by **Godwin Daniel** for **RaenestXDevCareers** — **#RaenestHackathon**
