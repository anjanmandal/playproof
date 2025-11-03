# Movement Safety API

Node.js/TypeScript backend for the movement safety platform. Provides endpoints for:

- **Movement assessments** (`POST /assessments`) – send sampled frames to obtain knee mechanics cues.
- **Daily risk twin** (`POST /risk`) – classify athlete status and receive a single practice change.
- **Rehab co-pilot** (`POST /rehab`) – evaluate hop/strength symmetry and clearance guidance.
- **Audience rewrites** (`POST /audience`) – tailor AI outputs for coaches, athletes, parents, or clinicians.

## Getting Started

```bash
cd backend
cp .env.example .env
# edit .env with your OpenAI key and database/storage values
npm install
# bootstrap sqlite schema and seed demo data
npm run db:apply
npm run prisma:generate
npm run seed
npm run dev
```

The API listens on `PORT` (default `4000`).

### Mock Mode

If you do not have OpenAI access in development, set `USE_OPENAI_MOCKS=true` in `.env`. The service will return deterministic mock payloads.

### Example Requests

```bash
# Movement assessment (replace frame URLs with signed links)
curl -X POST http://localhost:4000/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "athleteId": "rb-12",
    "drillType": "unplanned_cut",
    "frames": [
      { "id": "frame-1", "url": "https://example.com/frame1.jpg", "capturedAt": "2024-07-01T12:00:00Z" }
    ]
  }'

# Login as seeded coach
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"coach@example.com","password":"coach123"}'

# Upload media sample
curl -X POST http://localhost:4000/media/upload \
  -H "Authorization: Bearer <token>" \
  -F file=@/path/to/frame.jpg
```

## Next Steps

- Wire up authentication/authorization.
- Persist assessments and recommendations in PostgreSQL via Prisma.
- Integrate storage service for clip uploads and frame extraction queue.
- Expand OpenAI prompts with stricter JSON schema validation once responses are tested.
