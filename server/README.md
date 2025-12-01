# Rhythme Server

Backend API server for the Rhythme collaborative beat-making platform.

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials

# Initialize database
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run dev
```

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Authentication (Coming Soon)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Sessions (Coming Soon)
- `POST /api/sessions`
- `GET /api/sessions`
- `GET /api/sessions/:id`
- `DELETE /api/sessions/:id`

### Tracks (Coming Soon)
- `POST /api/tracks`
- `GET /api/tracks`
- `GET /api/tracks/:id`

## WebSocket Events

### Session Events
- `join-session` - Join a session room
- `leave-session` - Leave a session room
- `join-queue` - Join the turn queue
- `update-beat` - Update beat data
- `complete-turn` - Complete current turn

More documentation coming soon!
