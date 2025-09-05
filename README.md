# 🎥 MERN Take-Home Assignment: Screen Recorder App

A small web application that records the active browser tab’s screen with microphone audio and allows users to **preview, download, and upload** the recording to a simple MERN backend.

---

## 🚀 Goal

- Record the **current browser tab** with microphone audio.  
- Provide **preview, download, and upload** functionality.  
- Store and manage recordings using a **Node.js + Express + SQL backend**.  
- Deploy on **Vercel/Netlify (Frontend)** and **Render (Backend)**.  

---

## ✅ Features

### Frontend (React)
- Record the current tab (Chrome required).
- Capture **video + mic audio** using `navigator.mediaDevices.getDisplayMedia` and `MediaRecorder`.
- Controls: **Start / Stop** recording.
- **Live timer** (max limit: 3 minutes).
- After stopping, preview the recording in a video player.
- **Download** recordings locally.
- **Upload** recordings to the backend.
- Display **success/failure** messages.
- **Recordings List** page:
  - Show **Title, Size, Created Date**.
  - Inline playback option.

### Backend (Node.js + Express + SQL)
- **API Endpoints**
  - `POST /api/recordings` → Upload recording + metadata.
  - `GET /api/recordings` → Fetch list of recordings.
  - `GET /api/recordings/:id` → Fetch/play a specific recording.
- **Database (SQL)**
  - Store metadata: `filename`, `size`, `createdAt`.
  - Store file via **cloud storage / GridFS / local storage**.

### Deployment
- Frontend: **Vercel / Netlify**
- Backend: **Render**
- SQL Database for persistence.

---


## 🏃‍♂️Quick Start

```bash
# 1) Clone
git clone https://github.com/Jasswanth-dev/amberflux-assignment
cd employee-management-system

# 2) Backend
cd backend
npm install
node server.js

# 3) Frontend (new terminal)
cd frontend
npm install
npm start
```

---
