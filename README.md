# Cal.com Clone

A scheduling/booking web application that replicates Cal.com's design and functionality. Users can create event types, set their availability, and let others book time slots through a public booking page.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- shadcn/ui components
- Tailwind CSS
- React Router for navigation
- TanStack Query for data fetching
- Axios for API calls

### Backend
- Node.js with Express.js
- TypeScript
- Drizzle ORM
- PostgreSQL (Neon DB)

## Features

### Core Features
- ✅ Event Types Management (CRUD)
- ✅ Availability Settings (weekly schedule, timezone)
- ✅ Public Booking Page (calendar, time slots, booking form)
- ✅ Bookings Dashboard (upcoming, past, cancelled)
- ✅ Double-booking prevention

### UI/UX
- ✅ Dark mode design matching Cal.com
- ✅ Responsive layout
- ✅ Modern sidebar navigation

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts      # Database connection
│   │   │   ├── schema.ts     # Drizzle schema
│   │   │   └── seed.ts       # Sample data seeder
│   │   ├── routes/
│   │   │   ├── eventTypes.ts # Event types API
│   │   │   ├── availability.ts # Availability API
│   │   │   └── bookings.ts   # Bookings API
│   │   └── index.ts          # Express server
│   ├── drizzle.config.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Sidebar, Layout
│   │   │   └── ui/           # shadcn components
│   │   ├── pages/            # All page components
│   │   ├── lib/              # Utilities and API client
│   │   └── App.tsx           # Main app with routing
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon recommended)

### Database Setup

1. Create a database at [neon.tech](https://neon.tech)
2. Copy the connection string

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Neon database URL to .env
# DATABASE_URL=postgresql://user:pass@host/database?sslmode=require

# Push schema to database
npm run db:push

# Seed the database with sample data
npm run db:seed

# Start development server
npm run dev
```

Backend runs on http://localhost:3001

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on http://localhost:5173

## API Endpoints

### Event Types
- `GET /api/event-types` - List all event types
- `GET /api/event-types/:id` - Get event type by ID
- `GET /api/event-types/slug/:slug` - Get event type by slug
- `POST /api/event-types` - Create event type
- `PUT /api/event-types/:id` - Update event type
- `DELETE /api/event-types/:id` - Delete event type

### Availability
- `GET /api/availability` - Get weekly availability
- `PUT /api/availability/:id` - Update single day
- `PUT /api/availability` - Bulk update availability
- `GET /api/availability/timezone` - Get timezone
- `PUT /api/availability/timezone` - Update timezone

### Bookings
- `GET /api/bookings` - List bookings (with filters)
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/available-slots` - Get available time slots
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

## Database Schema

### event_types
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(255) | Event title |
| description | TEXT | Event description |
| duration | INTEGER | Duration in minutes |
| slug | VARCHAR(255) | URL slug (unique) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

### availability
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| day_of_week | INTEGER | 0=Sunday, 6=Saturday |
| start_time | TIME | Start time |
| end_time | TIME | End time |
| is_enabled | BOOLEAN | Whether day is available |

### bookings
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_type_id | UUID | Foreign key to event_types |
| booker_name | VARCHAR(255) | Booker's name |
| booker_email | VARCHAR(255) | Booker's email |
| date | VARCHAR(10) | Booking date (YYYY-MM-DD) |
| start_time | TIME | Start time |
| end_time | TIME | End time |
| status | VARCHAR(50) | confirmed/cancelled |

### settings
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| key | VARCHAR(100) | Setting key |
| value | VARCHAR(255) | Setting value |

## Assumptions

1. **No Authentication**: The admin side assumes a default logged-in user. Authentication is not implemented as per assignment requirements.
2. **Single User**: The application is designed for a single user's calendar.
3. **Timezone**: Timezone is stored in settings and applies to all availability/bookings.

## License

MIT
