import { pgTable, uuid, varchar, text, integer, timestamp, time, boolean } from 'drizzle-orm/pg-core';

// Event Types table
export const eventTypes = pgTable('event_types', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    duration: integer('duration').notNull(), // in minutes
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Availability table
export const availability = pgTable('availability', {
    id: uuid('id').defaultRandom().primaryKey(),
    dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday, 1 = Monday, etc.
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    isEnabled: boolean('is_enabled').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Timezone setting
export const settings = pgTable('settings', {
    id: uuid('id').defaultRandom().primaryKey(),
    key: varchar('key', { length: 100 }).notNull().unique(),
    value: varchar('value', { length: 255 }).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Bookings table
export const bookings = pgTable('bookings', {
    id: uuid('id').defaultRandom().primaryKey(),
    eventTypeId: uuid('event_type_id').references(() => eventTypes.id, { onDelete: 'cascade' }).notNull(),
    bookerName: varchar('booker_name', { length: 255 }).notNull(),
    bookerEmail: varchar('booker_email', { length: 255 }).notNull(),
    date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD format
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    status: varchar('status', { length: 50 }).default('confirmed').notNull(), // confirmed, cancelled
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types for TypeScript
export type EventType = typeof eventTypes.$inferSelect;
export type NewEventType = typeof eventTypes.$inferInsert;
export type Availability = typeof availability.$inferSelect;
export type NewAvailability = typeof availability.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Setting = typeof settings.$inferSelect;
