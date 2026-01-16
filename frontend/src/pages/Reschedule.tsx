import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, parseISO } from 'date-fns';
import { Clock, Globe, ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { bookingsApi, availabilityApi } from '@/lib/api';

interface Booking {
    id: string;
    eventTypeId: string;
    eventTitle: string;
    eventDuration: number;
    eventSlug: string;
    bookerName: string;
    bookerEmail: string;
    date: string;
    startTime: string;
    endTime: string;
}

export function ReschedulePage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [timezone, setTimezone] = useState('Asia/Kolkata');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [step, setStep] = useState<'calendar' | 'confirm' | 'success'>('calendar');
    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        if (!bookingId) return;
        setLoading(true);
        try {
            const [bookingRes, timezoneRes] = await Promise.all([
                bookingsApi.getById(bookingId),
                availabilityApi.getTimezone(),
            ]);
            setBooking(bookingRes.data);
            setTimezone(timezoneRes.data.timezone);
        } catch (error) {
            console.error('Failed to fetch booking:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async (date: Date) => {
        if (!booking) return;

        setLoadingSlots(true);
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            const response = await bookingsApi.getAvailableSlots(dateStr, booking.eventSlug);
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
        setStep('confirm');
    };

    const handleReschedule = async () => {
        if (!booking || !selectedDate || !selectedSlot) return;

        setSubmitting(true);
        try {
            const [hours, minutes] = selectedSlot.split(':');
            const startHour = parseInt(hours);
            const startMin = parseInt(minutes);
            let endHour = startHour;
            let endMin = startMin + booking.eventDuration;

            while (endMin >= 60) {
                endMin -= 60;
                endHour++;
            }

            const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}:00`;

            await bookingsApi.reschedule(booking.id, {
                date: format(selectedDate, 'yyyy-MM-dd'),
                startTime: selectedSlot,
                endTime,
            });

            setStep('success');
        } catch (error: any) {
            console.error('Failed to reschedule:', error);
            alert(error.response?.data?.error || 'Failed to reschedule');
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

        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

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

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="font-medium text-muted-foreground">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center py-16 text-center">
                        <h2 className="text-2xl font-bold mb-2">Booking not found</h2>
                        <p className="text-muted-foreground mb-8">This booking doesn't exist or has been cancelled.</p>
                        <Button onClick={() => navigate('/bookings')}>Back to Bookings</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl border-primary/10">
                    <CardContent className="flex flex-col items-center py-12">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 ring-8 ring-green-500/5">
                            <Check className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-center">Rescheduled!</h2>
                        <p className="text-muted-foreground text-center mb-8">
                            Your booking has been successfully rescheduled.
                        </p>
                        <div className="w-full p-6 bg-secondary/30 border border-border rounded-xl mb-8 font-medium">
                            <p className="text-sm text-muted-foreground mb-2">New Date & Time:</p>
                            <p className="text-lg">{selectedDate && format(selectedDate, 'MMMM d, yyyy')}</p>
                            <p className="text-lg">{selectedSlot && formatTime(selectedSlot)}</p>
                        </div>
                        <Button onClick={() => navigate('/bookings')} className="w-full">
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-8 px-4 sm:py-12 space-y-8">
            <div className="w-full max-w-4xl flex justify-start items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/bookings')}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Bookings
                </Button>
            </div>

            <Card className="w-full max-w-4xl shadow-xl overflow-hidden">
                <div className="flex flex-col md:flex-row min-h-[550px]">
                    {/* Sidebar with original booking info */}
                    <div className="w-full md:w-1/3 p-8 bg-secondary/10 border-b md:border-b-0 md:border-r border-border">
                        <div className="inline-block p-3 rounded-xl bg-primary/10 mb-6">
                            <CalendarIcon className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold mb-1">Reschedule Meeting</h2>
                        <p className="text-sm text-muted-foreground mb-6">{booking.eventTitle}</p>

                        <div className="space-y-6 pt-6 border-t border-border/50">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Current Time</p>
                                <p className="font-semibold">{format(parseISO(booking.date), 'EEEE, MMM d, yyyy')}</p>
                                <p className="font-semibold text-primary">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Duration</p>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Clock className="w-4 h-4 opacity-70" />
                                    {booking.eventDuration} minutes
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <Globe className="w-4 h-4 opacity-70" />
                                {timezone}
                            </div>
                        </div>
                    </div>

                    {/* Main area */}
                    <div className="flex-1 p-8 lg:p-10">
                        {step === 'calendar' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-xl font-bold mb-8">Select a New Date & Time</h3>
                                <div className="flex flex-col lg:flex-row gap-10">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-8">
                                            <h4 className="font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</h4>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addDays(currentMonth, -30))}>
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addDays(currentMonth, 30))}>
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d}>{d}</div>)}
                                        </div>
                                        <div className="grid grid-cols-7 gap-2">
                                            {generateCalendarDays().map((date, i) => (
                                                <div key={i} className="aspect-square">
                                                    {date && (
                                                        <button
                                                            onClick={() => !isDateDisabled(date) && handleDateSelect(date)}
                                                            disabled={isDateDisabled(date)}
                                                            className={`w-full h-full rounded-xl text-sm font-bold transition-all
                                                                ${selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                                                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                                                    : isDateDisabled(date) ? 'opacity-20 cursor-not-allowed' : 'hover:bg-primary/10 hover:text-primary'}
                                                            `}
                                                        >
                                                            {date.getDate()}
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedDate && (
                                        <div className="lg:w-64 animate-in slide-in-from-right-8 duration-500">
                                            <h4 className="font-bold mb-6 text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {format(selectedDate, 'EEEE, MMM d')}
                                            </h4>
                                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {loadingSlots ? (
                                                    <div className="space-y-2">
                                                        {[1, 2, 3, 4].map(i => <div key={i} className="h-12 w-full bg-secondary/50 animate-pulse rounded-lg" />)}
                                                    </div>
                                                ) : availableSlots.length === 0 ? (
                                                    <p className="text-sm text-muted-foreground text-center py-10 italic">No slots available</p>
                                                ) : (
                                                    availableSlots.map((slot) => (
                                                        <Button
                                                            key={slot}
                                                            variant={selectedSlot === slot ? 'default' : 'outline'}
                                                            className="w-full py-6 font-bold"
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

                        {step === 'confirm' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto py-10">
                                <Button variant="ghost" className="mb-6 -ml-4" onClick={() => setStep('calendar')}>
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Change Date/Time
                                </Button>

                                <h3 className="text-2xl font-bold mb-2">Confirm Reschedule</h3>
                                <p className="text-muted-foreground mb-8 text-sm">Review your new meeting details below.</p>

                                <div className="space-y-6 bg-secondary/30 p-8 rounded-2xl border border-border">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">New Date</p>
                                            <p className="text-xl font-bold">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">New Time</p>
                                            <p className="text-xl font-bold text-primary">{selectedSlot && formatTime(selectedSlot)}</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border/50">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Meeting with</p>
                                        <p className="font-bold text-lg">{booking.bookerName}</p>
                                        <p className="text-sm text-muted-foreground">{booking.bookerEmail}</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleReschedule}
                                    className="w-full mt-10 py-7 text-lg font-bold shadow-xl shadow-primary/20"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Rescheduling...' : 'Confirm Reschedule'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
