import { Router } from 'express';
import { db } from '../db/index.js';
import { availability, settings } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all availability schedules
router.get('/', async (_req, res) => {
    try {
        const result = await db.select().from(availability).orderBy(availability.dayOfWeek);
        res.json(result);
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
});

// Update availability for a specific day
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, isEnabled } = req.body;

        const result = await db.update(availability)
            .set({
                startTime,
                endTime,
                isEnabled,
            })
            .where(eq(availability.id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Availability not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ error: 'Failed to update availability' });
    }
});

// Bulk update availability
router.put('/', async (req, res) => {
    try {
        const updates = req.body;

        if (!Array.isArray(updates)) {
            return res.status(400).json({ error: 'Expected array of availability updates' });
        }

        const results = [];
        for (const update of updates) {
            const { id, startTime, endTime, isEnabled } = update;
            const result = await db.update(availability)
                .set({
                    startTime,
                    endTime,
                    isEnabled,
                })
                .where(eq(availability.id, id))
                .returning();

            if (result.length > 0) {
                results.push(result[0]);
            }
        }

        res.json(results);
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ error: 'Failed to update availability' });
    }
});

// Get timezone setting
router.get('/timezone', async (_req, res) => {
    try {
        const result = await db.select().from(settings).where(eq(settings.key, 'timezone'));

        if (result.length === 0) {
            return res.json({ timezone: 'UTC' });
        }

        res.json({ timezone: result[0].value });
    } catch (error) {
        console.error('Error fetching timezone:', error);
        res.status(500).json({ error: 'Failed to fetch timezone' });
    }
});

// Update timezone setting
router.put('/timezone', async (req, res) => {
    try {
        const { timezone } = req.body;

        if (!timezone) {
            return res.status(400).json({ error: 'Timezone is required' });
        }

        // Try to update existing
        const existing = await db.select().from(settings).where(eq(settings.key, 'timezone'));

        if (existing.length > 0) {
            await db.update(settings)
                .set({ value: timezone, updatedAt: new Date() })
                .where(eq(settings.key, 'timezone'));
        } else {
            await db.insert(settings).values({ key: 'timezone', value: timezone });
        }

        res.json({ timezone });
    } catch (error) {
        console.error('Error updating timezone:', error);
        res.status(500).json({ error: 'Failed to update timezone' });
    }
});

export default router;
