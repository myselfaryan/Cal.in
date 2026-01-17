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

// Seed endpoint (temporary - remove after seeding)
app.post('/api/seed', async (_req, res) => {
    try {
        const { db } = await import('./db/index.js');
        const { eventTypes, availability, settings, bookings, schedules } = await import('./db/schema.js');

        console.log('🌱 Seeding database via API...');

        // Clear existing data in correct order (respecting foreign keys)
        await db.delete(bookings);
        await db.delete(eventTypes);
        await db.delete(availability);
        await db.delete(settings);
        await db.delete(schedules);

        console.log('✅ Cleared existing data');

        // Create a default schedule
        const [defaultSchedule] = await db.insert(schedules).values({
            name: 'Default Schedule',
            isDefault: true,
            timeZone: 'Asia/Kolkata',
        }).returning();

        console.log('✅ Created default schedule');

        // Create event types
        const eventTypesData = await db.insert(eventTypes).values([
            {
                title: '15 Minute Meeting',
                description: 'A quick 15-minute introductory call to discuss your needs.',
                duration: 15,
                slug: '15min',
            },
            {
                title: '30 Minute Meeting',
                description: 'A standard 30-minute meeting for detailed discussions.',
                duration: 30,
                slug: '30min',
            },
            {
                title: '60 Minute Consultation',
                description: 'An in-depth 60-minute consultation for comprehensive planning.',
                duration: 60,
                slug: '60min',
            },
        ]).returning();

        console.log('✅ Created event types:', eventTypesData.length);

        // Create availability (Monday to Friday, 9 AM to 5 PM)
        const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
        const availabilityData = await db.insert(availability).values(
            daysOfWeek.map(day => ({
                scheduleId: defaultSchedule.id,
                dayOfWeek: day,
                startTime: '09:00:00',
                endTime: '17:00:00',
                isEnabled: true,
            }))
        ).returning();

        // Add disabled weekend entries
        await db.insert(availability).values([
            { scheduleId: defaultSchedule.id, dayOfWeek: 0, startTime: '09:00:00', endTime: '17:00:00', isEnabled: false },
            { scheduleId: defaultSchedule.id, dayOfWeek: 6, startTime: '09:00:00', endTime: '17:00:00', isEnabled: false },
        ]);

        console.log('✅ Created availability schedules:', availabilityData.length + 2);

        // Create timezone setting
        await db.insert(settings).values({
            key: 'timezone',
            value: 'Asia/Kolkata',
        });

        console.log('✅ Created settings');

        // Create sample bookings
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const bookingsData = await db.insert(bookings).values([
            {
                eventTypeId: eventTypesData[0].id,
                bookerName: 'John Doe',
                bookerEmail: 'john@example.com',
                date: formatDate(tomorrow),
                startTime: '10:00:00',
                endTime: '10:15:00',
                status: 'confirmed',
            },
            {
                eventTypeId: eventTypesData[1].id,
                bookerName: 'Jane Smith',
                bookerEmail: 'jane@example.com',
                date: formatDate(tomorrow),
                startTime: '14:00:00',
                endTime: '14:30:00',
                status: 'confirmed',
            },
            {
                eventTypeId: eventTypesData[2].id,
                bookerName: 'Bob Wilson',
                bookerEmail: 'bob@example.com',
                date: formatDate(dayAfter),
                startTime: '11:00:00',
                endTime: '12:00:00',
                status: 'confirmed',
            },
        ]).returning();

        console.log('✅ Created sample bookings:', bookingsData.length);
        console.log('🎉 Seeding complete!');

        res.json({ success: true, message: 'Database seeded successfully!' });
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
});

// Start server (only when not running as serverless function)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

export default app;
