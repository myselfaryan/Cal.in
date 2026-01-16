import { Router } from 'express';
import { db } from '../db/index.js';
import { schedules, availability, settings, scheduleOverrides } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

// --- SCHEDULES ---

// Get all schedules
router.get('/', async (_req, res) => {
    try {
        const result = await db.select().from(schedules).orderBy(schedules.createdAt);
        res.json(result);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Failed to fetch schedules' });
    }
});

// Create a new schedule
router.post('/', async (req, res) => {
    try {
        const { name, timeZone } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Schedule name is required' });
        }

        const newSchedule = await db.insert(schedules).values({
            name,
            timeZone: timeZone || 'UTC',
            isDefault: false, // Default to false, logic can be added to handle 'first one is default'
        }).returning();

        // Initialize default availability for this schedule (All 7 days, 9-5 M-F enabled)
        const defaultSlots = [];
        for (let day = 0; day <= 6; day++) {
            defaultSlots.push({
                scheduleId: newSchedule[0].id,
                dayOfWeek: day,
                startTime: '09:00:00',
                endTime: '17:00:00',
                isEnabled: day !== 0 && day !== 6 // Disable Sunday (0) and Saturday (6)
            });
        }
        await db.insert(availability).values(defaultSlots);

        res.status(201).json(newSchedule[0]);
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Failed to create schedule' });
    }
});

// Get a specific schedule with its availability and overrides
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const schedule = await db.select().from(schedules).where(eq(schedules.id, id));

        if (schedule.length === 0) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        const slots = await db.select().from(availability)
            .where(eq(availability.scheduleId, id))
            .orderBy(availability.dayOfWeek);

        const overrides = await db.select().from(scheduleOverrides)
            .where(eq(scheduleOverrides.scheduleId, id))
            .orderBy(scheduleOverrides.date);

        res.json({ ...schedule[0], availability: slots, overrides });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Failed to fetch schedule' });
    }
});

// Update schedule (name, timezone, default status)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, timeZone, isDefault } = req.body;

        const result = await db.update(schedules)
            .set({ name, timeZone, isDefault, updatedAt: new Date() })
            .where(eq(schedules.id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        // If set to default, unset others (simplified logic)
        if (isDefault) {
            const allSchedules = await db.select().from(schedules);
            for (const s of allSchedules) {
                if (s.id !== id && s.isDefault) {
                    await db.update(schedules).set({ isDefault: false }).where(eq(schedules.id, s.id));
                }
            }
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ error: 'Failed to update schedule' });
    }
});

// Delete a schedule
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Availability cascades, so just delete schedule
        const result = await db.delete(schedules).where(eq(schedules.id, id)).returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        res.json({ message: 'Schedule deleted' });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ error: 'Failed to delete schedule' });
    }
});


// --- AVAILABILITY SLOTS ---

// Update availability for a specific schedule (Bulk Update)
router.put('/:scheduleId/slots', async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const updates = req.body; // Array of availability slots

        if (!Array.isArray(updates)) {
            return res.status(400).json({ error: 'Expected array of availability updates' });
        }

        // 1. Delete all existing slots for this schedule (Simplest way to handle full sync)
        await db.delete(availability).where(eq(availability.scheduleId, scheduleId));

        // 2. Insert new slots
        if (updates.length > 0) {
            const slotsToInsert = updates.map(u => ({
                scheduleId,
                dayOfWeek: u.dayOfWeek,
                startTime: u.startTime,
                endTime: u.endTime,
                isEnabled: u.isEnabled
            }));
            const inserted = await db.insert(availability).values(slotsToInsert).returning();
            res.json(inserted);
        } else {
            res.json([]);
        }

    } catch (error) {
        console.error('Error updating availability slots:', error);
        res.status(500).json({ error: 'Failed to update availability slots' });
    }
});

// --- DATE OVERRIDES ---

// Add a date override
router.post('/:scheduleId/overrides', async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const { date, startTime, endTime, isEnabled } = req.body;

        if (!date || !startTime || !endTime) {
            return res.status(400).json({ error: 'Date, start time, and end time are required' });
        }

        const newOverride = await db.insert(scheduleOverrides).values({
            scheduleId,
            date,
            startTime,
            endTime,
            isEnabled: isEnabled ?? true,
        }).returning();

        res.status(201).json(newOverride[0]);
    } catch (error) {
        console.error('Error creating override:', error);
        res.status(500).json({ error: 'Failed to create override' });
    }
});

// Update a date override
router.put('/overrides/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, isEnabled } = req.body;

        const result = await db.update(scheduleOverrides)
            .set({
                startTime,
                endTime,
                isEnabled,
            })
            .where(eq(scheduleOverrides.id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Override not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error updating override:', error);
        res.status(500).json({ error: 'Failed to update override' });
    }
});

// Delete a date override
router.delete('/overrides/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.delete(scheduleOverrides).where(eq(scheduleOverrides.id, id)).returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Override not found' });
        }
        res.json({ message: 'Override deleted' });
    } catch (error) {
        console.error('Error deleting override:', error);
        res.status(500).json({ error: 'Failed to delete override' });
    }
});

// Get timezone setting (Global fallback)
router.get('/settings/timezone', async (_req, res) => {
    try {
        const result = await db.select().from(settings).where(eq(settings.key, 'timezone'));
        if (result.length === 0) return res.json({ timezone: 'UTC' });
        res.json({ timezone: result[0].value });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

export default router;
