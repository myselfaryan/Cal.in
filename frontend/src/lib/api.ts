import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Event Types API
export const eventTypesApi = {
    getAll: () => api.get('/event-types'),
    getById: (id: string) => api.get(`/event-types/${id}`),
    getBySlug: (slug: string) => api.get(`/event-types/slug/${slug}`),
    create: (data: { title: string; description?: string; duration: number; slug: string; enabled?: boolean; bookingFields?: any[] }) =>
        api.post('/event-types', data),
    update: (id: string, data: { title?: string; description?: string; duration?: number; slug?: string; enabled?: boolean; bookingFields?: any[] }) =>
        api.put(`/event-types/${id}`, data),
    delete: (id: string) => api.delete(`/event-types/${id}`),
};

// Availability API (Schedules)
export const availabilityApi = {
    getAll: () => api.get('/availability'),
    getById: (id: string) => api.get(`/availability/${id}`),
    create: (data: { name: string; timeZone?: string }) => api.post('/availability', data),
    update: (id: string, data: { name?: string; timeZone?: string; isDefault?: boolean }) => api.put(`/availability/${id}`, data),
    delete: (id: string) => api.delete(`/availability/${id}`),
    // Bulk update slots for a specific schedule
    updateSlots: (scheduleId: string, data: Array<{ dayOfWeek: number; startTime: string; endTime: string; isEnabled: boolean }>) =>
        api.put(`/availability/${scheduleId}/slots`, data),
    // Date Overrides
    createOverride: (scheduleId: string, data: { date: string; startTime: string; endTime: string; isEnabled: boolean }) =>
        api.post(`/availability/${scheduleId}/overrides`, data),
    updateOverride: (id: string, data: { startTime: string; endTime: string; isEnabled: boolean }) =>
        api.put(`/availability/overrides/${id}`, data),
    deleteOverride: (id: string) => api.delete(`/availability/overrides/${id}`),
    // Legacy global timezone (fallback)
    getTimezone: () => api.get('/availability/settings/timezone'),
};

// Bookings API
export const bookingsApi = {
    getAll: (params?: { status?: string; upcoming?: string }) => api.get('/bookings', { params }),
    getById: (id: string) => api.get(`/bookings/${id}`),
    getAvailableSlots: (date: string, eventTypeSlug: string) =>
        api.get('/bookings/available-slots', { params: { date, eventTypeSlug } }),
    create: (data: {
        eventTypeId: string;
        bookerName: string;
        bookerEmail: string;
        date: string;
        startTime: string;
        endTime: string;
        responses?: any;
    }) => api.post('/bookings', data),
    cancel: (id: string) => api.put(`/bookings/${id}/cancel`),
    reschedule: (id: string, data: { date: string; startTime: string; endTime: string }) =>
        api.put(`/bookings/${id}`, data),
};

export default api;
