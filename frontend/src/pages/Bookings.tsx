import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, User, Mail, SlidersHorizontal, Search, ChevronDown, History, Ban, UserCheck, Repeat, CalendarCheck, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
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
    eventSlug: string;
    responses?: Record<string, any>;
}

export function BookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

    // Details Dialog State
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
            } else if (activeTab === 'canceled') {
                params.status = 'cancelled';
            } else if (activeTab === 'unconfirmed') {
                params.status = 'pending';
            }
            const response = await bookingsApi.getAll(params);
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (id: string) => {
        setBookingToCancel(id);
        setCancelDialogOpen(true);
    };

    const confirmCancel = async () => {
        if (!bookingToCancel) return;
        try {
            await bookingsApi.cancel(bookingToCancel);
            setCancelDialogOpen(false);
            setBookingToCancel(null);
            fetchBookings();
        } catch (error) {
            console.error('Failed to cancel booking:', error);
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

    const handleViewDetails = (booking: Booking, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedBooking(booking);
        setDetailsDialogOpen(true);
    };

    const renderBookingCard = (booking: Booking) => (
        <Card
            key={booking.id}
            className="group relative hover:border-primary/50 transition-all duration-200 hover:shadow-md cursor-pointer"
            onClick={(e) => {
                const isButton = (e.target as HTMLElement).closest('button');
                if (!isButton) {
                    navigate(`/book/${booking.eventSlug}`);
                }
            }}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-1 h-full min-h-[60px] rounded-full bg-primary group-hover:bg-primary/80 transition-colors"></div>
                        <div>
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {booking.eventTitle}
                            </h3>
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
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative z-10 hover:bg-secondary"
                            onClick={(e) => handleViewDetails(booking, e)}
                            title="View Details"
                        >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        {booking.status === 'confirmed' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative z-10 hover:bg-secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/reschedule/${booking.id}`);
                                }}
                                title="Reschedule"
                            >
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                            </Button>
                        )}
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
                                className="relative z-10 hover:bg-destructive/10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancel(booking.id);
                                }}
                            >
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const tabs = [
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'unconfirmed', label: 'Unconfirmed' },
        { id: 'recurring', label: 'Recurring' },
        { id: 'past', label: 'Past' },
        { id: 'canceled', label: 'Canceled' },
    ];

    const getEmptyState = () => {
        switch (activeTab) {
            case 'upcoming':
                return {
                    icon: <CalendarCheck className="w-8 h-8 text-muted-foreground" />,
                    title: 'No upcoming bookings',
                    description: 'You have no upcoming bookings. As soon as someone books a time with you it will show up here.'
                };
            case 'unconfirmed':
                return {
                    icon: <UserCheck className="w-8 h-8 text-muted-foreground" />,
                    title: 'No unconfirmed bookings',
                    description: 'You have no unconfirmed bookings.'
                };
            case 'recurring':
                return {
                    icon: <Repeat className="w-8 h-8 text-muted-foreground" />,
                    title: 'No recurring bookings',
                    description: 'You have no recurring bookings.'
                };
            case 'past':
                return {
                    icon: <History className="w-8 h-8 text-muted-foreground" />,
                    title: 'No past bookings',
                    description: 'Your past bookings will appear here.'
                };
            case 'canceled':
                return {
                    icon: <Ban className="w-8 h-8 text-muted-foreground" />,
                    title: 'No canceled bookings',
                    description: 'You have no canceled bookings. Your canceled bookings will show up here.'
                };
            default:
                return {
                    icon: <Calendar className="w-8 h-8 text-muted-foreground" />,
                    title: 'No bookings found',
                    description: ''
                };
        }
    };

    const emptyState = getEmptyState();

    return (
        <div className="p-4 sm:p-8 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground">Bookings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    See upcoming and past events booked through your event type links.
                </p>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-1 bg-secondary/30 p-1 rounded-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === tab.id
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-border mx-2" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2 h-8">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64">
                            <div className="p-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search"
                                        className="pl-8 h-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="py-2">Event Type</DropdownMenuItem>
                            <DropdownMenuItem className="py-2">Team</DropdownMenuItem>
                            <DropdownMenuItem className="py-2">Attendees Name</DropdownMenuItem>
                            <DropdownMenuItem className="py-2">Attendee Email</DropdownMenuItem>
                            <DropdownMenuItem className="py-2">Date Range</DropdownMenuItem>
                            <DropdownMenuItem className="py-2">Booking UID</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 border-border/50">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                Saved filters
                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>No saved filters</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Bookings Content */}
            <div>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-secondary/50 rounded-xl animate-pulse border border-border/50"></div>
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="mt-12 flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-dashed border-border/50 bg-secondary/5">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center mb-6">
                            {emptyState.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{emptyState.title}</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-sm">
                            {emptyState.description}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map(renderBookingCard)}
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent className="max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Cancel Booking</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCancelDialogOpen(false)}
                            className="bg-secondary/20 border-border/50"
                        >
                            No, keep it
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmCancel}
                        >
                            Yes, cancel booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Booking Details Dialog */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>
                            Full information about this booking.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBooking && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Event Type</h4>
                                    <p className="font-medium">{selectedBooking.eventTitle}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                    <Badge variant="outline">{selectedBooking.status}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Date & Time</h4>
                                    <p className="text-sm">
                                        {formatDate(selectedBooking.date)}<br />
                                        {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Booker</h4>
                                    <p className="text-sm">
                                        {selectedBooking.bookerName}<br />
                                        <span className="text-muted-foreground">{selectedBooking.bookerEmail}</span>
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <h4 className="font-medium">Responses</h4>
                                {selectedBooking.responses && Object.keys(selectedBooking.responses).length > 0 ? (
                                    <dl className="space-y-4">
                                        {Object.entries(selectedBooking.responses).map(([key, value]) => (
                                            <div key={key} className="space-y-1">
                                                <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
                                                <dd className="text-sm whitespace-pre-wrap">{String(value)}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No custom responses provided.</p>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
