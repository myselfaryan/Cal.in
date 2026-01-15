import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { Clock, Globe, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bookingsApi, eventTypesApi, availabilityApi } from '@/lib/api';

interface EventType {
    id: string;
    title: string;
    description: string;
    duration: number;
    slug: string;
}

export function PublicBookingPage() {
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
    const [bookingForm, setBookingForm] = useState({ name: '', email: '' });
    const [submitting, setSubmitting] = useState(false);
    const [, setBookingId] = useState<string | null>(null);

    // Calendar state
    const [currentMonth, setCurrentMonth] = useState(new Date());

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

    // Generate calendar days
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
        const today = startOfDay(new Date());
        return isBefore(date, today);
    };

    const isDateSelected = (date: Date) => {
        if (!selectedDate) return false;
        return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!eventType) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center py-16">
                        <h2 className="text-xl font-semibold mb-2">Event not found</h2>
                        <p className="text-muted-foreground text-center">
                            This event type doesn't exist or has been removed.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'confirmation') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center py-12">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">Booking Confirmed!</h2>
                        <p className="text-muted-foreground text-center mb-6">
                            Your booking has been confirmed. You'll receive a confirmation email shortly.
                        </p>
                        <div className="w-full p-4 bg-secondary rounded-lg mb-6">
                            <div className="text-center">
                                <h3 className="font-medium">{eventType.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedSlot && formatTime(selectedSlot)} ({eventType.duration} mins)
                                </p>
                            </div>
                        </div>
                        <Button onClick={() => navigate('/')} variant="outline">
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <div className="flex flex-col md:flex-row">
                    {/* Left Side - Event Info */}
                    <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-border">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-semibold mb-4">
                            I
                        </div>
                        <h2 className="text-xl font-semibold">{eventType.title}</h2>
                        <p className="text-muted-foreground text-sm mt-2">{eventType.description}</p>
                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{eventType.duration} min</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            <span>{timezone}</span>
                        </div>
                    </div>

                    {/* Right Side - Calendar or Form */}
                    <div className="flex-1 p-6">
                        {step === 'calendar' && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">Select a Date & Time</h3>

                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Calendar */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium">
                                                {format(currentMonth, 'MMMM yyyy')}
                                            </h4>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                                <div key={day} className="text-muted-foreground py-2">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-1">
                                            {generateCalendarDays().map((date, index) => (
                                                <div key={index} className="aspect-square">
                                                    {date && (
                                                        <button
                                                            onClick={() => !isDateDisabled(date) && handleDateSelect(date)}
                                                            disabled={isDateDisabled(date)}
                                                            className={`w-full h-full rounded-md text-sm transition-colors ${isDateSelected(date)
                                                                ? 'bg-primary text-primary-foreground'
                                                                : isDateDisabled(date)
                                                                    ? 'text-muted-foreground/50 cursor-not-allowed'
                                                                    : 'hover:bg-secondary'
                                                                }`}
                                                        >
                                                            {date.getDate()}
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Slots */}
                                    {selectedDate && (
                                        <div className="lg:w-48">
                                            <h4 className="font-medium mb-4">
                                                {format(selectedDate, 'EEE, MMM d')}
                                            </h4>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {loadingSlots ? (
                                                    <div className="text-sm text-muted-foreground">Loading slots...</div>
                                                ) : availableSlots.length === 0 ? (
                                                    <div className="text-sm text-muted-foreground">No available slots</div>
                                                ) : (
                                                    availableSlots.map((slot) => (
                                                        <Button
                                                            key={slot}
                                                            variant={selectedSlot === slot ? 'default' : 'outline'}
                                                            className="w-full justify-center"
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
                            </>
                        )}

                        {step === 'form' && (
                            <>
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
                                    <Button type="submit" className="w-full" disabled={submitting}>
                                        {submitting ? 'Confirming...' : 'Confirm Booking'}
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
