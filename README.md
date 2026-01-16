# Cal.in

A modern scheduling/booking web application inspired by Cal.com. Users can create event types with custom booking fields, manage multiple availability schedules, and let others book time slots through a beautiful public booking page.

## 🚀 Live Demo

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway

## ✨ Features

### Core Features
- ✅ **Event Types Management** - Create, edit, enable/disable event types with custom durations
- ✅ **Custom Booking Fields** - Add custom questions (text, email, phone, textarea, checkbox, radio, select) to event types
- ✅ **Multiple Schedules** - Create and manage multiple availability schedules
- ✅ **Weekly Availability** - Configure availability for each day of the week
- ✅ **Date Overrides** - Set specific date overrides (block dates, custom hours)
- ✅ **Public Booking Page** - Beautiful calendar interface for booking appointments
- ✅ **Bookings Dashboard** - View upcoming, past, and cancelled bookings with tabs
- ✅ **Booking Cancellation** - Cancel bookings with confirmation
- ✅ **Rescheduling** - Allow users to reschedule existing bookings
- ✅ **Double-booking Prevention** - Automatically prevents overlapping bookings
- ✅ **Timezone Support** - Full timezone support for schedules

### UI/UX
- ✅ Dark mode design matching Cal.com aesthetic
- ✅ Responsive layout for all devices
- ✅ Modern sidebar navigation with Cal.com style icons
- ✅ Command menu (Cmd/Ctrl + K) for quick navigation
- ✅ Beautiful landing page with animations
- ✅ Framer Motion animations throughout

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite 7 | Build Tool |
| TailwindCSS 4 | Styling |
| shadcn/ui | UI Components |
| Radix UI | Headless Components |
| React Router 7 | Navigation |
| TanStack Query 5 | Data Fetching & Caching |
| Axios | HTTP Client |
| Framer Motion | Animations |
| date-fns | Date Utilities |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 5 | Web Framework |
| TypeScript | Type Safety |
| Drizzle ORM | Database ORM |
| PostgreSQL (Neon) | Database |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend Hosting |
| Railway | Backend Hosting |
| Neon | PostgreSQL Database |

## 📁 Project Structure

```
Cal.in/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts        # Database connection (Neon)
│   │   │   ├── schema.ts       # Drizzle schema definitions
│   │   │   └── seed.ts         # Database seeder
│   │   ├── routes/
│   │   │   ├── eventTypes.ts   # Event types CRUD API
│   │   │   ├── availability.ts # Schedules & availability API
│   │   │   └── bookings.ts     # Bookings management API
│   │   └── index.ts            # Express server setup
│   ├── drizzle.config.ts       # Drizzle configuration
│   ├── railway.json            # Railway deployment config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.tsx      # Main layout wrapper
│   │   │   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   │   │   └── CommandMenu.tsx # Cmd+K quick actions
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── pages/
│   │   │   ├── Landing.tsx         # Landing page
│   │   │   ├── EventTypes.tsx      # Event types list
│   │   │   ├── EventTypeEdit.tsx   # Create/Edit event type
│   │   │   ├── Bookings.tsx        # Bookings dashboard
│   │   │   ├── Availability.tsx    # Schedules list
│   │   │   ├── AvailabilityEdit.tsx # Schedule editor
│   │   │   ├── PublicBooking.tsx   # Public booking page
│   │   │   ├── Reschedule.tsx      # Reschedule booking page
│   │   │   ├── Insights.tsx        # Analytics (placeholder)
│   │   │   ├── Workflows.tsx       # Workflows (placeholder)
│   │   │   └── Teams.tsx           # Teams (placeholder)
│   │   ├── lib/
│   │   │   ├── api.ts          # API client with Axios
│   │   │   └── utils.ts        # Utility functions
│   │   ├── App.tsx             # Main app with routing
│   │   └── main.tsx            # Entry point
│   ├── vercel.json             # Vercel deployment config
│   └── package.json
│
└── README.md
```

## 🗄 Database Schema

### event_types
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(255) | Event title |
| description | TEXT | Event description |
| duration | INTEGER | Duration in minutes |
| slug | VARCHAR(255) | URL slug (unique) |
| enabled | BOOLEAN | Whether event type is active |
| booking_fields | JSON | Custom booking form fields |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

### schedules
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Schedule name |
| is_default | BOOLEAN | Default schedule flag |
| time_zone | VARCHAR(255) | Schedule timezone |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

### availability
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| schedule_id | UUID | Foreign key to schedules |
| day_of_week | INTEGER | 0=Sunday, 6=Saturday |
| start_time | TIME | Start time |
| end_time | TIME | End time |
| is_enabled | BOOLEAN | Whether day is available |
| created_at | TIMESTAMP | Creation timestamp |

### schedule_overrides
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| schedule_id | UUID | Foreign key to schedules |
| date | VARCHAR(10) | Specific date (YYYY-MM-DD) |
| start_time | TIME | Override start time |
| end_time | TIME | Override end time |
| is_enabled | BOOLEAN | If false, date is blocked |
| created_at | TIMESTAMP | Creation timestamp |

### bookings
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_type_id | UUID | Foreign key to event_types |
| booker_name | VARCHAR(255) | Booker's name |
| booker_email | VARCHAR(255) | Booker's email |
| date | VARCHAR(10) | Booking date (YYYY-MM-DD) |
| start_time | TIME | Booking start time |
| end_time | TIME | Booking end time |
| status | VARCHAR(50) | confirmed/cancelled |
| responses | JSON | Custom field responses |
| created_at | TIMESTAMP | Creation timestamp |

### settings
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| key | VARCHAR(100) | Setting key |
| value | VARCHAR(255) | Setting value |
| updated_at | TIMESTAMP | Update timestamp |

## 🔌 API Endpoints

### Event Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/event-types` | List all event types |
| GET | `/api/event-types/:id` | Get event type by ID |
| GET | `/api/event-types/slug/:slug` | Get event type by slug |
| POST | `/api/event-types` | Create event type |
| PUT | `/api/event-types/:id` | Update event type |
| PATCH | `/api/event-types/:id/toggle` | Toggle enabled status |
| DELETE | `/api/event-types/:id` | Delete event type |

### Schedules & Availability
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/availability/schedules` | List all schedules |
| GET | `/api/availability/schedules/:id` | Get schedule with availability |
| POST | `/api/availability/schedules` | Create new schedule |
| PUT | `/api/availability/schedules/:id` | Update schedule |
| DELETE | `/api/availability/schedules/:id` | Delete schedule |
| GET | `/api/availability` | Get all availability |
| PUT | `/api/availability` | Bulk update availability |
| POST | `/api/availability/overrides` | Add date override |
| GET | `/api/availability/overrides/:scheduleId` | Get schedule overrides |
| DELETE | `/api/availability/overrides/:id` | Delete override |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | List bookings (with filters) |
| GET | `/api/bookings/:id` | Get booking by ID |
| GET | `/api/bookings/available-slots` | Get available time slots |
| POST | `/api/bookings` | Create booking |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| POST | `/api/bookings/:id/reschedule` | Reschedule booking |

## 🚀 Setup Instructions

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

# Create .env file with API URL
echo "VITE_API_URL=http://localhost:3001" > .env

# Start development server
npm run dev
```

Frontend runs on http://localhost:5173

## 🚢 Deployment

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set the `DATABASE_URL` environment variable
3. Railway will automatically detect the `railway.json` config

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. The `vercel.json` handles API rewrites to the Railway backend

## 📝 Assumptions & Notes

1. **No Authentication**: The admin side assumes a default logged-in user. Authentication is not implemented as per assignment requirements.
2. **Single User**: The application is designed for a single user's calendar.
3. **Timezone**: Each schedule has its own timezone setting.
4. **Placeholder Pages**: Insights, Workflows, Teams, Apps, Routing, and Settings pages show "Coming Soon" placeholders.

## 📄 License

MIT
