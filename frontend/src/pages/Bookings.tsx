import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, X, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bookingsApi } from '@/lib/api';

interface Booking {
    id: string;
    eventTypeId: string;
    bookerName: string;
    bookerEmail: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    createdAt: string;
    eventTitle: string;
    eventDuration: number;
}

export function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchBookings();
    }, [activeTab]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params: { upcoming?: string; status?: string } = {};
            if (activeTab === 'upcoming') {
                params.upcoming = 'true';
                params.status = 'confirmed';
            } else if (activeTab === 'past') {
                params.upcoming = 'false';
            } else if (activeTab === 'cancelled') {
                params.status = 'cancelled';
            }
            const response = await bookingsApi.getAll(params);
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            try {
                await bookingsApi.cancel(id);
                fetchBookings();
            } catch (error) {
                console.error('Failed to cancel booking:', error);
            }
        }
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'EEEE, MMMM d, yyyy');
        } catch {
            return dateStr;
        }
    };

    const renderBookingCard = (booking: Booking) => (
        <Card key={booking.id} className="hover:border-muted-foreground/50 transition-colors">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-1 h-full min-h-[60px] rounded-full bg-primary"></div>
                        <div>
                            <h3 className="font-medium text-foreground">{booking.eventTitle}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(booking.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <User className="w-4 h-4" />
                                    {booking.bookerName}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    {booking.bookerEmail}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                            className={booking.status === 'cancelled' ? 'bg-destructive/20 text-destructive' : ''}
                        >
                            {booking.status}
                        </Badge>
                        {booking.status === 'confirmed' && activeTab === 'upcoming' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCancel(booking.id)}
                            >
                                <X className="w-4 h-4 text-destructive" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground">Bookings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    See upcoming and past events booked through your event type links.
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-secondary rounded animate-pulse"></div>
                            ))}
                        </div>
                    ) : bookings.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                                    <Calendar className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">No {activeTab} bookings</h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    {activeTab === 'upcoming'
                                        ? 'When someone books a time with you, it will appear here.'
                                        : activeTab === 'past'
                                            ? 'Your past bookings will appear here.'
                                            : 'Cancelled bookings will appear here.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {bookings.map(renderBookingCard)}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
