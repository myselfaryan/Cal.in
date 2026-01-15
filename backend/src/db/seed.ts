import { db } from './index.js';
import { eventTypes, availability, settings, bookings } from './schema.js';

async function seed() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await db.delete(bookings);
    await db.delete(eventTypes);
    await db.delete(availability);
    await db.delete(settings);

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
            dayOfWeek: day,
            startTime: '09:00:00',
            endTime: '17:00:00',
            isEnabled: true,
        }))
    ).returning();

    // Add disabled weekend entries
    await db.insert(availability).values([
        { dayOfWeek: 0, startTime: '09:00:00', endTime: '17:00:00', isEnabled: false },
        { dayOfWeek: 6, startTime: '09:00:00', endTime: '17:00:00', isEnabled: false },
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
    process.exit(0);
}

seed().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
