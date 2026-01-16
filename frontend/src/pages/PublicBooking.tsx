import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { Clock, Globe, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bookingsApi, eventTypesApi, availabilityApi } from '@/lib/api';

// ... imports ...

interface EventType {
    id: string;
    title: string;
    description: string;
    duration: number;
    slug: string;
    bookingFields?: Array<{
        id: string;
        label: string;
        type: string;
        required: boolean;
        placeholder?: string;
        options?: string[];
    }>;
}

export function PublicBookingPage() {
    // ... params, hooks ...
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const [eventType, setEventType] = useState<EventType | null>(null);
    const [timezone, setTimezone] = useState('Asia/Kolkata');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [step, setStep] = useState<'calendar' | 'form' | 'confirmation'>('calendar');
    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Form state
    const [bookingForm, setBookingForm] = useState({ name: '', email: '' });
    const [customResponses, setCustomResponses] = useState<Record<string, any>>({});

    const [submitting, setSubmitting] = useState(false);
    const [, setBookingId] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // ... useEffect & fetch calls (same as before) ...
    // Note: ensure fetchEventType sets the full event object including bookingFields

    useEffect(() => {
        fetchEventType();
    }, [slug]);

    const fetchEventType = async () => {
        try {
            const [eventRes, timezoneRes] = await Promise.all([
                eventTypesApi.getBySlug(slug!),
                availabilityApi.getTimezone(),
            ]);
            setEventType(eventRes.data);
            setTimezone(timezoneRes.data.timezone);
        } catch (error) {
            console.error('Failed to fetch event type:', error);
        } finally {
            setLoading(false);
        }
    };

    // ... fetchAvailableSlots, handleDateSelect, handleSlotSelect, formatTime, calendar utils ...
    const fetchAvailableSlots = async (date: Date) => {
        if (!eventType) return;

        setLoadingSlots(true);
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            const response = await bookingsApi.getAvailableSlots(dateStr, eventType.slug);
            setAvailableSlots(response.data.slots);
        } catch (error) {
            console.error('Failed to fetch slots:', error);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        fetchAvailableSlots(date);
    };

    const handleSlotSelect = (slot: string) => {
        setSelectedSlot(slot);
        setStep('form');
    };


    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventType || !selectedDate || !selectedSlot) return;

        setSubmitting(true);
        try {
            const [hours, minutes] = selectedSlot.split(':');
            const startHour = parseInt(hours);
            const startMin = parseInt(minutes);
            let endHour = startHour;
            let endMin = startMin + eventType.duration;

            while (endMin >= 60) {
                endMin -= 60;
                endHour++;
            }

            const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}:00`;

            const response = await bookingsApi.create({
                eventTypeId: eventType.id,
                bookerName: bookingForm.name,
                bookerEmail: bookingForm.email,
                date: format(selectedDate, 'yyyy-MM-dd'),
                startTime: selectedSlot,
                endTime,
                responses: customResponses
            });

            setBookingId(response.data.id);
            setStep('confirmation');
        } catch (error: any) {
            console.error('Failed to create booking:', error);
            alert(error.response?.data?.error || 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const days: (Date | null)[] = [];

        // Add padding for days before the first of the month
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const isDateDisabled = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isDateToday = (date: Date) => {
        return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    };

    const isDateSelected = (date: Date) => {
        if (!selectedDate) return false;
        return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    };


    // Only the rendering part needs major updates for the form
    if (loading) {
        // ... same loading ...
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="font-medium">Loading booking page...</p>
                </div>
            </div>
        );
    }

    if (!eventType) {
        // ... same not found ...
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-destructive/20">
                    <CardContent className="flex flex-col items-center py-16">
                        <h2 className="text-2xl font-bold mb-2">Event not found</h2>
                        <p className="text-muted-foreground text-center mb-8">
                            This event type doesn't exist or has been removed.
                        </p>
                        <Button onClick={() => navigate('/event-types')} size="lg">Back to Dashboard</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'confirmation') {
        // ... same confirmation ...
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl border-primary/10">
                    <CardContent className="flex flex-col items-center py-12">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 ring-8 ring-green-500/5">
                            <Check className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-center">Booking Confirmed!</h2>
                        <p className="text-muted-foreground text-center mb-8">
                            Your booking has been successfully scheduled.
                        </p>
                        <div className="w-full p-6 bg-secondary/30 border border-border rounded-xl mb-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Event</label>
                                    <h3 className="font-bold text-xl">{eventType.title}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</label>
                                        <p className="font-medium">{selectedDate && format(selectedDate, 'MMM d, yyyy')}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</label>
                                        <p className="font-medium">{selectedSlot && formatTime(selectedSlot)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => navigate('/event-types')} variant="outline" size="lg" className="w-full">
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-8 px-4 sm:py-12 lg:py-16 space-y-8">
            {/* ... Top Nav Button ... */}
            <div className="w-full max-w-4xl flex justify-start items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/event-types')}
                    className="group gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Button>
            </div>

            <Card className="w-full max-w-4xl shadow-2xl border-primary/5 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row min-h-[550px]">
                    {/* Left Side ... */}
                    <div className="w-full md:w-1/3 p-8 lg:p-10 border-b md:border-b-0 md:border-r border-border bg-secondary/10 flex flex-col">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-xl font-black mb-8 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                            {eventType.title.charAt(0)}
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-black tracking-tight leading-tight">{eventType.title}</h2>
                        <p className="text-muted-foreground text-sm mt-4 leading-relaxed font-medium">{eventType.description}</p>

                        <div className="space-y-4 mt-auto pt-8 border-t border-border/50">
                            <div className="flex items-center gap-3 text-sm font-semibold text-foreground/70">
                                <Clock className="w-5 h-5 text-primary" />
                                <span>{eventType.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-semibold text-foreground/70">
                                <Globe className="w-5 h-5 text-primary" />
                                <span>{timezone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side ... */}
                    <div className="flex-1 p-8 lg:p-10 bg-card">
                        {step === 'calendar' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-xl font-bold mb-8">Select a Date & Time</h3>

                                <div className="flex flex-col lg:flex-row gap-10">
                                    {/* Calendar View ... same logic ... */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-8">
                                            <h4 className="font-bold text-xl tracking-tight">
                                                {format(currentMonth, 'MMMM yyyy')}
                                            </h4>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                                                    onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                                                    onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                                <div key={day} className="py-2">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-3">
                                            {generateCalendarDays().map((date, index) => (
                                                <div key={index} className="aspect-square">
                                                    {date && (
                                                        <button
                                                            onClick={() => !isDateDisabled(date) && handleDateSelect(date)}
                                                            disabled={isDateDisabled(date)}
                                                            className={`w-full h-full rounded-2xl text-sm font-bold transition-all relative flex items-center justify-center
                                                                ${isDateSelected(date)
                                                                    ? 'bg-primary text-primary-foreground shadow-xl scale-110 ring-4 ring-primary/20 z-10'
                                                                    : isDateDisabled(date)
                                                                        ? 'text-muted-foreground/20 cursor-not-allowed'
                                                                        : 'hover:bg-primary/10 hover:text-primary'
                                                                }
                                                                ${isDateToday(date) && !isDateSelected(date) ? 'text-primary ring-2 ring-primary/20 bg-primary/5' : ''}
                                                            `}
                                                        >
                                                            {date.getDate()}
                                                            {isDateToday(date) && (
                                                                <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isDateSelected(date) ? 'bg-primary-foreground' : 'bg-primary'}`} />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Selector ... same logic ... */}
                                    {selectedDate && (
                                        <div className="lg:w-64 animate-in slide-in-from-right-8 duration-500">
                                            <h4 className="font-bold mb-6 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                {format(selectedDate, 'EEEE, MMM d')}
                                            </h4>
                                            <div className="space-y-3 max-h-[400px] pr-3 overflow-y-auto custom-scrollbar">
                                                {loadingSlots ? (
                                                    <div className="space-y-3">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <div key={i} className="h-14 w-full bg-secondary/50 animate-pulse rounded-xl" />
                                                        ))}
                                                    </div>
                                                ) : availableSlots.length === 0 ? (
                                                    <div className="text-sm font-medium text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                                                        No available slots for this day
                                                    </div>
                                                ) : (
                                                    availableSlots.map((slot) => (
                                                        <Button
                                                            key={slot}
                                                            variant={selectedSlot === slot ? 'default' : 'outline'}
                                                            className={`w-full py-7 text-lg font-bold rounded-xl transition-all ${selectedSlot === slot
                                                                ? 'shadow-xl scale-[1.03] bg-primary'
                                                                : 'hover:border-primary hover:bg-primary/5'
                                                                }`}
                                                            onClick={() => handleSlotSelect(slot)}
                                                        >
                                                            {formatTime(slot)}
                                                        </Button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 'form' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Button
                                    variant="ghost"
                                    className="mb-4"
                                    onClick={() => setStep('calendar')}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>

                                <div className="mb-6 p-4 bg-secondary rounded-lg">
                                    <p className="text-sm">
                                        <strong>{eventType.title}</strong>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at{' '}
                                        {selectedSlot && formatTime(selectedSlot)}
                                    </p>
                                </div>

                                <form onSubmit={handleBookingSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Your Name</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={bookingForm.name}
                                            onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={bookingForm.email}
                                            onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    {/* Custom Booking Fields Loop */}
                                    {eventType.bookingFields?.map((field) => (
                                        <div key={field.id} className="space-y-2">
                                            <Label htmlFor={field.id}>
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                            </Label>

                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    id={field.id}
                                                    required={field.required}
                                                    placeholder={field.placeholder}
                                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={customResponses[field.label] || ''}
                                                    onChange={(e) => setCustomResponses({ ...customResponses, [field.label]: e.target.value })}
                                                />
                                            ) : (
                                                <Input
                                                    id={field.id}
                                                    type={field.type}
                                                    required={field.required}
                                                    placeholder={field.placeholder}
                                                    value={customResponses[field.label] || ''}
                                                    onChange={(e) => setCustomResponses({ ...customResponses, [field.label]: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    ))}

                                    <Button type="submit" className="w-full" disabled={submitting}>
                                        {submitting ? 'Confirming...' : 'Confirm Booking'}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
