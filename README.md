# 🎙️ SpeakVaani — AI-Powered Speech Training & Coaching Platform

### **Speak • Analyze • Improve • Repeat**

**Designed & Developed by Er. Pankaj Kumar**

SpeakVaani is a full-stack AI-powered speech training and coaching platform that helps users improve their speaking skills through **real speech recording, AI transcription, deterministic speech metrics, qualitative AI feedback, attempt comparison, and progress tracking**.

> **Core Loop:**  
> 🎯 Choose → 🎙️ Speak → 🔴 Record → 📝 Transcribe → 📊 Analyze → 🤖 Get AI Feedback → 🔁 Improve → 📈 Track Progress

---

## 🌐 Live Demo

### 🚀 **[Try SpeakVaani Live](https://speakvani.vercel.app/)**

**Live Application:** https://speakvani.vercel.app/

> The frontend is deployed on Vercel. The application is designed as a full-stack system with a React frontend, Spring Boot backend, PostgreSQL persistence, Groq Whisper transcription, and Ollama-based AI coaching.

---

## ✨ Why SpeakVaani?

Unlike a simple speech-to-text application, SpeakVaani combines **speech recognition + deterministic Java analysis + AI-powered qualitative evaluation** into one coaching workflow.

### Key Capabilities

- 🎙️ **Real-time speech recording** using WebRTC and MediaRecorder
- 📝 **Speech-to-text transcription** using Groq Whisper
- 📊 **Deterministic speech metrics** calculated by a Java analysis engine
- 🤖 **AI-powered language and argument evaluation** using Ollama Llama 3.2
- 🔎 **Context-aware filler word detection**
- ⏱️ **Speaking speed / WPM analysis**
- 📚 **Sentence and word analysis**
- 🔄 **Attempt comparison** to evaluate improvement
- 💾 **PostgreSQL persistence** for speech-training data
- ⚡ **Caching support** for improved application performance
- 🛡️ **JWT-based authentication and Spring Security**
- 🔁 **Mock providers** for local development without external AI services

---

# 🧠 AI Speech Coaching Pipeline

SpeakVaani follows a multi-stage processing pipeline:

```text
                    USER
                      │
                      ▼
              🎙️ Speak & Record
                      │
                      ▼
           MediaRecorder / WebRTC
                      │
                      ▼
            ┌───────────────────┐
            │   Spring Boot API │
            └─────────┬─────────┘
                      │
                      ▼
             🎧 Groq Whisper STT
              whisper-large-v3-turbo
                      │
                      ▼
                📝 Transcript
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
     Java Metrics Engine   Ollama Llama 3.2
             │                 │
             │          Qualitative Analysis
             │                 │
             ▼                 ▼
      Words / WPM /       Language /
      Sentences /         Structure /
      Fillers             Arguments
             │                 │
             └────────┬────────┘
                      ▼
              🎯 Coaching Result
                      │
                      ▼
             PostgreSQL + Cache
                      │
                      ▼
             📈 Attempt Comparison
                      │
                      ▼
              🔁 Improve & Retry
```

---

# 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite |
| **UI** | Tailwind CSS v4, Lucide Icons |
| **Backend** | Spring Boot 3.4.x, Java 17/21 |
| **Security** | Spring Security, JWT |
| **Database** | PostgreSQL |
| **Database Migration** | Flyway |
| **Speech-to-Text** | Groq Whisper `whisper-large-v3-turbo` |
| **AI Coaching** | Ollama, Llama 3.2 |
| **Recording** | WebRTC, MediaRecorder |
| **API Architecture** | REST APIs |
| **Development Fallback** | Mock STT & Mock AI Providers |

---

# 🏗️ Full-Stack Architecture

```text
┌──────────────────────────────────────────────┐
│                  React 19                    │
│        TypeScript + Vite + Tailwind         │
└──────────────────────┬───────────────────────┘
                       │ REST API
                       ▼
┌──────────────────────────────────────────────┐
│              Spring Boot Backend             │
│                                              │
│  Spring Security + JWT                      │
│  Speech Processing                           │
│  Java Metrics Engine                         │
│  AI Integration                              │
│  REST Controllers / Services                 │
└──────────────┬───────────────┬───────────────┘
               │               │
               ▼               ▼
      ┌────────────────┐   ┌─────────────────┐
      │  Groq Whisper  │   │ Ollama Llama 3.2│
      │   Speech → Text│   │   AI Coaching   │
      └────────────────┘   └─────────────────┘
               │               │
               └───────┬───────┘
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              │ + Flyway Schema │
              └─────────────────┘
```

---

# 📊 Speech Analysis Engine

SpeakVaani does not depend entirely on an LLM for speech metrics.

The application uses a **deterministic Java metrics engine** for measurable speech characteristics.

### Metrics include:

- **Word Count**
- **Words Per Minute (WPM)**
- **Sentence Count**
- **Contextual Filler Detection**
- **Speech Structure Analysis**

The deterministic layer provides consistent measurable results, while the AI layer focuses on qualitative feedback such as:

- Language quality
- Communication structure
- Argument quality
- Overall response evaluation
- Areas for improvement

This hybrid approach combines **reliable programmatic analysis with AI-powered coaching**.

---

# 🤖 AI Integration

## Speech-to-Text — Groq Whisper

Recorded speech is processed through:

```text
Groq Whisper
      ↓
whisper-large-v3-turbo
      ↓
Real Transcript
```

The transcript then becomes the input for the speech analysis pipeline.

A **Mock STT provider** is also available for local development and testing.

---

## AI Coaching — Ollama Llama 3.2

After deterministic metrics are calculated, SpeakVaani uses **Llama 3.2 through Ollama** for qualitative evaluation.

```text
Transcript
    +
Speech Metrics
    ↓
Llama 3.2
    ↓
Language Evaluation
    ↓
Structure Evaluation
    ↓
Argument Evaluation
    ↓
Coaching Feedback
```

A **Mock AI provider** is available when Ollama is not configured.

---

# 🔐 Security & Configuration

API credentials are designed to remain on the **Spring Boot backend** rather than being exposed through the React frontend.

Example backend configuration:

```bash
# Groq Whisper
GROQ_API_KEY=your_groq_api_key_here
STT_PROVIDER=groq

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
AI_PROVIDER=ollama

# PostgreSQL
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/speakvaani_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# JWT
JWT_SECRET=your_jwt_secret_here
```

### Security Principle

```text
Frontend
   │
   │ REST API
   ▼
Spring Boot Backend
   │
   ├── Groq API Key
   ├── Ollama
   ├── PostgreSQL
   └── JWT Security
```

> **Important:** Never place `GROQ_API_KEY`, database credentials, or JWT secrets inside frontend source code or commit them to GitHub.

---

# 🚀 Run Locally

## 1. Clone the Project

```bash
git clone <your-github-repository-url>
cd speakvaani
```

---

## 2. Start PostgreSQL

Create a PostgreSQL database:

```text
speakvaani_db
```

Then configure:

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/speakvaani_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

Flyway migrations will manage the database schema.

---

## 3. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend:

```text
http://localhost:8085
```

A Maven distribution is also bundled under `/maven` for environments without a global Maven installation.

---

## 4. Start the Frontend

From the project root:

```bash
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Local Development Without AI Services

You can run the application with mock providers:

```bash
STT_PROVIDER=mock
AI_PROVIDER=mock
```

This allows the application workflow to be tested without configuring Groq Whisper or Ollama.

---

# 📁 Project Structure

```text
SpeakVaani/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── Dockerfile
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── public/
│
├── .github/
│
├── package.json
├── vite.config.*
├── vercel.json
└── README.md
```

---

# 🌍 Deployment Architecture

SpeakVaani is designed as a **multi-service full-stack application**:

```text
                   🌐 USER
                      │
                      ▼
             ┌─────────────────┐
             │ Vercel Frontend │
             │ React + Vite    │
             └────────┬────────┘
                      │
                      │ REST API
                      ▼
             ┌─────────────────┐
             │ Spring Boot API │
             │ Java Backend    │
             └───────┬─────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Groq       Ollama    PostgreSQL
      Whisper     Llama 3.2
```

### Recommended Hosting

| Component | Platform Options |
|---|---|
| React Frontend | Vercel / Netlify |
| Spring Boot Backend | Render / Railway / Fly.io |
| PostgreSQL | Neon / Render / Supabase |

---

# 📌 Engineering Highlights

### Full-Stack Development

Built an end-to-end application spanning:

**React → REST APIs → Spring Boot → AI Services → PostgreSQL**

### AI Integration

Integrated external AI services for:

- Speech recognition
- Transcript generation
- Qualitative language analysis
- AI coaching

### Hybrid AI Architecture

Combined:

**Deterministic Java Metrics + LLM-based Qualitative Evaluation**

This avoids relying on an LLM for every measurable metric.

### Production-Oriented Security

Implemented backend-side handling for sensitive configuration together with:

- Spring Security
- JWT authentication
- Environment variables
- Database credentials isolation

### Database Engineering

Uses:

- PostgreSQL
- Flyway database migrations
- Persistence layer
- Caching

### Developer-Friendly Architecture

Includes mock providers so core application workflows can be developed and tested without requiring every external AI service during local development.

---

# 🎯 What This Project Demonstrates

This project demonstrates practical experience with:

```text
Java
   │
   ├── Spring Boot
   ├── Spring Security
   ├── REST APIs
   └── JWT
        │
        ▼
AI Engineering
   │
   ├── Groq Whisper
   ├── Ollama
   └── Llama 3.2
        │
        ▼
Frontend Engineering
   │
   ├── React
   ├── TypeScript
   ├── Vite
   └── Tailwind CSS
        │
        ▼
Data Layer
   │
   ├── PostgreSQL
   ├── Flyway
   └── Caching
```

---

# 🔒 GitHub Security

Before pushing the project:

```text
.env
.env.local
.env.production
```

should **not** be committed.

Use `.env.example` for documenting required environment variables.

Never commit:

- API keys
- JWT secrets
- Database passwords
- Production credentials

---

# 👨‍💻 Developer

### **Er. Pankaj Kumar**

**B.Tech — Computer Science & Engineering**

Interested in building practical software using:

**Java • Spring Boot • React • AI/ML • REST APIs • PostgreSQL • Cloud Technologies**

---

## 🚀 Project

**SpeakVaani — AI-Powered Speech Training & Coaching Platform**

### 🔗 Live Application

**[https://speakvaani.vercel.app/](https://speakvaani.vercel.app/)**

---

## ⭐ If You Like This Project

If SpeakVaani is useful or interesting, consider giving the repository a ⭐ on GitHub.

**Built with Java, React, AI and a focus on practical software engineering.**

---
