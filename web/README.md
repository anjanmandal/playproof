# HealthTech Web Portal

A React + Material UI dashboard that surfaces the movement safety, daily risk, and rehab workflows exposed by the Node/Prisma backend.

## Prerequisites

- Node.js 20 (the backend already targets this version). Using `nvm use 20` keeps alignment with Expo/mobile tooling.
- Backend API running locally (see `../backend/README.md`). The frontend expects it on `http://localhost:4000` by default.

## Getting Started

```bash
cd web
npm install
cp .env.example .env        # adjust VITE_API_BASE_URL if needed
npm run dev
```

This boots Vite on `http://localhost:5173` (or the port defined in `.env`). The dev server strictly binds to that port to avoid the Expo freeport bug.

## Build & Preview

```bash
npm run build   # type-check + production bundle in dist/
npm run preview # serve the build locally on the same port
```

## Project Structure

- `src/api`: Axios client + typed helpers for movement, risk, rehab, athletes, and audience rewrite calls.
- `src/providers/AuthProvider.tsx`: Auth context with localStorage hydration + JWT header wiring.
- `src/components/layout`: App shell with responsive drawer + top bar.
- `src/pages`: Auth screens and dashboard modules (Movement, Risk, Rehab, Portal, Overview). The Movement coach screen can now capture short clips, auto-sample key frames, upload them, and play the AI cues via Web Speech.
- `src/theme.ts`: Central Material UI theme tweaks shared across the app.

The routes mirror the Expo app: unauthenticated users land on `/login` or `/register`, while authenticated users load the drawer layout with tabs under `/`, `/movement`, `/risk`, `/rehab`, and `/portal`.

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for the backend (defaults to `http://localhost:4000`).
- `VITE_PORT`: Optional override for the Vite dev/preview port (defaults to 5173/4173).

## Capturing & Uploading Media

The Movement coach view supports direct capture on devices that expose `getUserMedia`/MediaRecorder and the camera-capable file picker (mobile browsers). Record a 3–5 s clip and the app will extract landing/plant/push-off stills, upload them to `/media/upload`, submit the assessment, and immediately read the coaching cues aloud. You can still paste secure URLs or manually upload images if preferred.
