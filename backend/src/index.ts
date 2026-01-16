import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import eventTypesRouter from './routes/eventTypes.js';
import availabilityRouter from './routes/availability.js';
import bookingsRouter from './routes/bookings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/event-types', eventTypesRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/bookings', bookingsRouter);

// Root route
app.get('/', (_req, res) => {
    res.json({
        message: 'Cal.in API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            eventTypes: '/api/event-types',
            availability: '/api/availability',
            bookings: '/api/bookings'
        }
    });
});

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
