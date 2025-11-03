# Movement Safety Platform

End-to-end prototype for an on-field movement safety coach, daily ACL risk “twin”, rehab co-pilot, and multi-audience communication portal.

## Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI (`npm install -g expo-cli`) or use `npx expo`
- iOS/Android simulator or Expo Go for running the mobile client

## 1. Backend

```bash
cd backend
cp .env.example .env
# update .env with your OpenAI API key (or set USE_OPENAI_MOCKS=true)
npm install
npm run db:apply           # apply generated SQLite migrations
npm run prisma:generate    # regenerate Prisma client
npm run seed               # optional demo data (coach/player accounts)
npm run dev                # start API on http://localhost:4000
```

Seeded demo accounts:

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Coach | `coach@example.com`  | `coach123`|
| AT/PT | `therapist@example.com` | `rehab123`|
| Athlete | `rb12@example.com` | `player123`|

Key endpoints:

- `POST /auth/login` — obtain JWT (use seed credentials)
- `POST /assessments` — movement frame assessment
- `POST /risk` — daily risk classification
- `POST /rehab` — rehab clearance evaluation
- `POST /media/upload` — upload images/videos (multipart)
- `GET /athletes` / `GET /athletes/:id` — roster + dashboard

For more detail see `backend/README.md` and `docs/architecture.md`.

## 2. Web App (React + MUI)

```bash
cd web
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if backend not on http://localhost:4000
npm run dev             # http://localhost:5173 by default
```

The web dashboard mirrors the mobile flows with a Material UI shell: drawer navigation, movement coach, risk twin, rehab co-pilot, and the audience rewrite portal. The Movement view now records short clips, auto-samples landing/plant/push-off stills, uploads them to the backend, and speaks the returned cues through the browser. Authentication shares the same backend JWTs, so seeded accounts above work here as well.

For build/preview instructions see `web/README.md`.

## 3. Mobile App

```bash
cd mobile
npm install
npx expo start             # press i/a/w for iOS/Android/Web
```

The app prompts for authentication. Use the seeded accounts above or create new users (coach, AT/PT, athlete, parent). Features include:

- **Movement Coach**: capture/upload frames, call AI assessment, review cue history.
- **Risk Twin**: log daily workload/conditions, receive risk classification, track history, acknowledge recommendations.
- **Rehab Co-Pilot**: upload hop/strength videos, compute clearance updates, browse rehab timeline.
- **Portal**: team roster with live snapshots, multi-audience rewrite tool, quick sign-out.

Media uploads use the backend `/media/upload` endpoint. When running on a device, ensure the backend URL in `mobile/app.json` (`extra.apiBaseUrl`) points to a network-accessible address.

## 4. Tips

- Run `npx tsc --noEmit` in both `backend/` and `mobile/` for type checks.
- Toggle `USE_OPENAI_MOCKS=true` in `.env` to bypass OpenAI responses during offline development.
- Uploaded files are stored in `backend/uploads` by default; update `MEDIA_UPLOAD_DIR` if needed.

## 5. Next Steps

- Add background job to extract key frames from uploaded clips automatically.
- Wire up push notifications for high-risk days or rehab regressions.
- Harden auth with refresh tokens/role-based policies and API rate limiting.
