import { Router } from 'express';
import { db } from '../db/index.js';
import { eventTypes } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all event types
router.get('/', async (_req, res) => {
    try {
        const result = await db.select().from(eventTypes).orderBy(eventTypes.createdAt);
        res.json(result);
    } catch (error) {
        console.error('Error fetching event types:', error);
        res.status(500).json({ error: 'Failed to fetch event types' });
    }
});

// Get single event type by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.select().from(eventTypes).where(eq(eventTypes.id, id));

        if (result.length === 0) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching event type:', error);
        res.status(500).json({ error: 'Failed to fetch event type' });
    }
});

// Get event type by slug (for public booking page)
router.get('/slug/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await db.select().from(eventTypes).where(eq(eventTypes.slug, slug));

        if (result.length === 0) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching event type:', error);
        res.status(500).json({ error: 'Failed to fetch event type' });
    }
});

// Create event type
router.post('/', async (req, res) => {
    try {
        const { title, description, duration, slug, bookingFields } = req.body;

        if (!title || !duration || !slug) {
            return res.status(400).json({ error: 'Title, duration, and slug are required' });
        }

        const result = await db.insert(eventTypes).values({
            title,
            description: description || '',
            duration: parseInt(duration),
            slug,
            enabled: req.body.enabled !== undefined ? req.body.enabled : true,
            bookingFields: bookingFields || [],
        }).returning();

        res.status(201).json(result[0]);
    } catch (error: any) {
        console.error('Error creating event type:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create event type' });
    }
});

// Update event type
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, duration, slug } = req.body;
        const updateData: any = {
            updatedAt: new Date(),
        };

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (duration !== undefined) updateData.duration = parseInt(duration);
        if (slug !== undefined) updateData.slug = slug;
        if (req.body.enabled !== undefined) updateData.enabled = req.body.enabled;
        if (req.body.bookingFields !== undefined) updateData.bookingFields = req.body.bookingFields;

        const result = await db.update(eventTypes)
            .set(updateData)
            .where(eq(eventTypes.id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        res.json(result[0]);
    } catch (error: any) {
        console.error('Error updating event type:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({ error: 'Failed to update event type' });
    }
});

// Delete event type
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.delete(eventTypes).where(eq(eventTypes.id, id)).returning();

        if (result.length === 0) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        res.json({ message: 'Event type deleted successfully' });
    } catch (error) {
        console.error('Error deleting event type:', error);
        res.status(500).json({ error: 'Failed to delete event type' });
    }
});

export default router;
