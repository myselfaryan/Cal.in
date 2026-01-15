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
    create: (data: { title: string; description?: string; duration: number; slug: string }) =>
        api.post('/event-types', data),
    update: (id: string, data: { title: string; description?: string; duration: number; slug: string }) =>
        api.put(`/event-types/${id}`, data),
    delete: (id: string) => api.delete(`/event-types/${id}`),
};

// Availability API
export const availabilityApi = {
    getAll: () => api.get('/availability'),
    update: (id: string, data: { startTime: string; endTime: string; isEnabled: boolean }) =>
        api.put(`/availability/${id}`, data),
    bulkUpdate: (data: Array<{ id: string; startTime: string; endTime: string; isEnabled: boolean }>) =>
        api.put('/availability', data),
    getTimezone: () => api.get('/availability/timezone'),
    updateTimezone: (timezone: string) => api.put('/availability/timezone', { timezone }),
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
    }) => api.post('/bookings', data),
    cancel: (id: string) => api.put(`/bookings/${id}/cancel`),
};

export default api;
