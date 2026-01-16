import { Router } from 'express';
import { db } from '../db/index.js';
import { bookings, eventTypes, availability } from '../db/schema.js';
import { eq, and, gte, lte, desc, asc, ne } from 'drizzle-orm';

const router = Router();

// Get all bookings (with event type info)
router.get('/', async (req, res) => {
    try {
        const { status, upcoming } = req.query;
        const today = new Date().toISOString().split('T')[0];

        let query = db
            .select({
                id: bookings.id,
                eventTypeId: bookings.eventTypeId,
                bookerName: bookings.bookerName,
                bookerEmail: bookings.bookerEmail,
                date: bookings.date,
                startTime: bookings.startTime,
                endTime: bookings.endTime,
                status: bookings.status,
                createdAt: bookings.createdAt,
                eventTitle: eventTypes.title,
                eventDuration: eventTypes.duration,
                eventSlug: eventTypes.slug,
            })
            .from(bookings)
            .leftJoin(eventTypes, eq(bookings.eventTypeId, eventTypes.id));

        // Filter by status if provided
        const conditions = [];
        if (status) {
            conditions.push(eq(bookings.status, status as string));
        }

        // Filter upcoming or past
        if (upcoming === 'true') {
            conditions.push(gte(bookings.date, today));
        } else if (upcoming === 'false') {
            conditions.push(lte(bookings.date, today));
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions)) as typeof query;
        }

        const result = await query.orderBy(asc(bookings.date), asc(bookings.startTime));
        res.json(result);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get available time slots for a specific date and event type
router.get('/available-slots', async (req, res) => {
    try {
        const { date, eventTypeSlug } = req.query;

        if (!date || !eventTypeSlug) {
            return res.status(400).json({ error: 'Date and event type slug are required' });
        }

        // Get event type
        const eventType = await db.select().from(eventTypes).where(eq(eventTypes.slug, eventTypeSlug as string));
        if (eventType.length === 0) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        const duration = eventType[0].duration;

        // Get day of week from date
        const dateObj = new Date(date as string);
        const dayOfWeek = dateObj.getDay();

        // Get availability for that day
        const dayAvailability = await db.select()
            .from(availability)
            .where(and(
                eq(availability.dayOfWeek, dayOfWeek),
                eq(availability.isEnabled, true)
            ));

        if (dayAvailability.length === 0) {
            return res.json({ slots: [] });
        }

        const startTime = dayAvailability[0].startTime;
        const endTime = dayAvailability[0].endTime;

        // Get existing bookings for that date
        const existingBookings = await db.select()
            .from(bookings)
            .where(and(
                eq(bookings.date, date as string),
                eq(bookings.status, 'confirmed')
            ));

        // Generate available slots
        const slots = generateTimeSlots(startTime, endTime, duration, existingBookings);

        res.json({ slots, eventType: eventType[0] });
    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({ error: 'Failed to fetch available slots' });
    }
});

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const { eventTypeId, bookerName, bookerEmail, date, startTime, endTime, responses } = req.body;

        if (!eventTypeId || !bookerName || !bookerEmail || !date || !startTime || !endTime) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check for existing booking at the same time
        const existing = await db.select()
            .from(bookings)
            .where(and(
                eq(bookings.date, date),
                eq(bookings.startTime, startTime),
                eq(bookings.status, 'confirmed')
            ));

        if (existing.length > 0) {
            return res.status(400).json({ error: 'This time slot is already booked' });
        }

        const result = await db.insert(bookings).values({
            eventTypeId,
            bookerName,
            bookerEmail,
            date,
            startTime,
            endTime,
            status: 'confirmed',
            responses: responses || {},
        }).returning();

        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Cancel a booking
router.put('/:id/cancel', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.update(bookings)
            .set({ status: 'cancelled' })
            .where(eq(bookings.id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// Reschedule/Update a booking
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date, startTime, endTime } = req.body;

        if (!date || !startTime || !endTime) {
            return res.status(400).json({ error: 'Date, start time, and end time are required' });
        }

        // Check if booking exists
        const booking = await db.select().from(bookings).where(eq(bookings.id, id));
        if (booking.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check for existing booking at the same time (excluding current booking)
        const existing = await db.select()
            .from(bookings)
            .where(and(
                eq(bookings.date, date),
                eq(bookings.startTime, startTime),
                eq(bookings.status, 'confirmed'),
                ne(bookings.id, id) // Exclude current booking
            ));

        if (existing.length > 0) {
            return res.status(400).json({ error: 'This time slot is already booked' });
        }

        const result = await db.update(bookings)
            .set({
                date,
                startTime,
                endTime,
                // updatedAt: new Date(), // removed as column doesn't exist
            })
            .where(eq(bookings.id, id))
            .returning();

        res.json(result[0]);
    } catch (error) {
        console.error('Error rescheduling booking:', error);
        res.status(500).json({ error: 'Failed to reschedule booking' });
    }
});

// Get single booking
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db
            .select({
                id: bookings.id,
                eventTypeId: bookings.eventTypeId,
                bookerName: bookings.bookerName,
                bookerEmail: bookings.bookerEmail,
                date: bookings.date,
                startTime: bookings.startTime,
                endTime: bookings.endTime,
                status: bookings.status,
                responses: bookings.responses,
                createdAt: bookings.createdAt,
                eventTitle: eventTypes.title,
                eventDuration: eventTypes.duration,
                eventDescription: eventTypes.description,
                eventSlug: eventTypes.slug,
            })
            .from(bookings)
            .leftJoin(eventTypes, eq(bookings.eventTypeId, eventTypes.id))
            .where(eq(bookings.id, id));

        if (result.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// Helper function to generate time slots
function generateTimeSlots(
    startTime: string,
    endTime: string,
    duration: number,
    existingBookings: any[]
): string[] {
    const slots: string[] = [];

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    const bookedTimes = new Set(existingBookings.map(b => b.startTime));

    while (true) {
        const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}:00`;

        // Calculate slot end time
        let slotEndHour = currentHour;
        let slotEndMin = currentMin + duration;

        while (slotEndMin >= 60) {
            slotEndMin -= 60;
            slotEndHour++;
        }

        // Check if slot end is within bounds
        if (slotEndHour > endHour || (slotEndHour === endHour && slotEndMin > endMin)) {
            break;
        }

        // Only add slot if not already booked
        if (!bookedTimes.has(slotStart)) {
            slots.push(slotStart);
        }

        // Move to next slot
        currentMin += duration;
        while (currentMin >= 60) {
            currentMin -= 60;
            currentHour++;
        }
    }

    return slots;
}

export default router;
