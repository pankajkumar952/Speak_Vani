# SpeakVaani — AI-Powered Speech Training & Coaching Platform

**Designed & Developed by Er. Pankaj Kumar**

SpeakVaani is a full-stack interactive speaking training and coaching platform built around the core loop:
**Choose → Speak → Record → Transcribe (Groq Whisper) → Analyze (Java Metrics + Ollama Llama 3.2) → Improve → Retry → Track Progress**.

---

## 🎙️ Real AI Speech Coaching Pipeline

```text
User speaks
     ↓
MediaRecorder (WebM audio/video)
     ↓
Spring Boot REST API
     ↓
Groq Whisper Speech-to-Text (`whisper-large-v3-turbo`)
     ↓
Real Transcript Text
     ↓
Java Deterministic Metrics Engine (Words, WPM, Sentences, Contextual Fillers)
     ↓
Ollama Llama 3.2 (Qualitative Language, Structure & Argument Evaluation)
     ↓
PostgreSQL Persistence (Flyway V6 Schema) & Caching
     ↓
AI Speech Coach Result Page with Attempt Comparison
```

---

## 🛠️ Tech Stack

* **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons
* **Backend**: Spring Boot 3.4.x + Java 17/21 + Spring Security + JWT
* **Database**: PostgreSQL + Flyway Migrations
* **Speech-to-Text**: Groq Whisper API (`whisper-large-v3-turbo`) with Mock STT provider fallback
* **AI Analysis**: Ollama Llama 3.2 with deterministic NLP fallback
* **Recording**: WebRTC + MediaRecorder (.webm)

---

## ⚙️ Environment Configuration

Set the following environment variables on the **Spring Boot backend** (never in the frontend):

```bash
# Speech-to-Text (Groq Whisper)
GROQ_API_KEY=your_groq_api_key_here
STT_PROVIDER=groq # 'groq' for real Whisper STT, 'mock' for local dev mock

# LLM Coaching (Ollama)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
AI_PROVIDER=ollama # 'ollama' or 'mock'

# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/speakvaani_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

> **Security Note**: `GROQ_API_KEY` is only read by the Spring Boot backend server and is never sent to the browser or stored in React code.

---

## 🚀 Running the Application

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8085`.

### 2. Start the Frontend
```bash
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

> The backend needs a running **PostgreSQL** instance (create a database named `speakvaani_db`, or change `SPRING_DATASOURCE_URL`). If you don't want to set up Groq/Ollama yet, set `STT_PROVIDER=mock` and `AI_PROVIDER=mock` to run everything locally with mock data.

A Maven distribution is already bundled under `/maven` in case you don't have Maven installed globally — you can run it with `./maven/apache-maven-3.9.9/bin/mvn spring-boot:run` from the `backend` folder instead of a system-wide `mvn`.

---

## 📤 Pushing This Project to GitHub

1. Create a new **empty** repository on GitHub (no README/license, so it doesn't conflict) — e.g. `speakvaani`.
2. From the project's root folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — SpeakVaani by Er. Pankaj Kumar"
   git branch -M main
   git remote add origin https://github.com/<your-username>/speakvaani.git
   git push -u origin main
   ```
3. **Before pushing**, double-check `.env` (if you created one locally) is listed in `.gitignore` so your API keys never get committed. Only `.env.example` should be tracked.
4. If `git` asks for credentials, use a [Personal Access Token](https://github.com/settings/tokens) instead of your GitHub password (GitHub no longer accepts passwords over HTTPS).

---

## 🌐 Where to Deploy It Live

This is a two-part app (a static React frontend + a Java Spring Boot backend + a PostgreSQL database), so it needs a **frontend host** and a **backend host**:

| Part | Recommended Free/Low-Cost Options | Notes |
|---|---|---|
| **Frontend** (Vite/React build) | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | Connect your GitHub repo, set the build command to `npm run build` and the output directory to `dist`. A `vercel.json` is already included in this project. |
| **Backend** (Spring Boot / Java) | [Render](https://render.com), [Railway](https://railway.app), or [Fly.io](https://fly.io) | Deploy the `backend` folder as a "Web Service" using its Dockerfile/Maven build. Add all the environment variables listed above in the host's dashboard. |
| **Database** (PostgreSQL) | Render Postgres, [Neon](https://neon.tech), or [Supabase](https://supabase.com) | Any managed Postgres works — just point `SPRING_DATASOURCE_URL` at it. |

**Suggested simplest path:**
1. Deploy PostgreSQL on **Neon** or **Render** — copy the connection string.
2. Deploy the `backend/` folder on **Render** (Java/Maven web service) — paste the DB connection string and your `GROQ_API_KEY`/`JWT_SECRET` as environment variables there.
3. Deploy the frontend (repo root) on **Vercel** — in the frontend's environment variables, point `src/services/api.ts` / your API base URL to the live Render backend URL instead of `localhost:8085`.
4. Once both are live, your app is reachable at your Vercel URL (e.g. `speakvaani.vercel.app`), fully working end-to-end.

---

design — everything else (colors, fonts) will still apply automatically.
