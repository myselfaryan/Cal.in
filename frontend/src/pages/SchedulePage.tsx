import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, ArrowRight, Calendar, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { eventTypesApi } from '@/lib/api';

interface EventType {
    id: string;
    title: string;
    description: string;
    duration: number;
    slug: string;
    enabled: boolean;
}

export function SchedulePage() {
    const navigate = useNavigate();
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await eventTypesApi.getAll();
                // Only show enabled event types
                setEventTypes(response.data.filter((et: EventType) => et.enabled));
            } catch (error) {
                console.error('Failed to fetch event types:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEventTypes();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div
                        onClick={() => navigate('/')}
                        className="text-xl font-black lowercase tracking-tighter cursor-pointer hover:opacity-70 transition-opacity text-gray-900"
                    >
                        cal.ai
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span>Asia/Kolkata</span>
                    </div>
                </div>
            </header>

            {/* Profile Section */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
                        <User className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2 text-gray-900">Book a Meeting</h1>
                    <p className="text-gray-600 font-medium max-w-md mx-auto">
                        Select an event type below to schedule a time with me.
                    </p>
                </div>

                {/* Event Types List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : eventTypes.length === 0 ? (
                        <Card className="border-dashed border-2 border-gray-200 bg-white shadow-sm">
                            <CardContent className="flex flex-col items-center justify-center py-20">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 border border-gray-100">
                                    <Calendar className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-black mb-3 text-gray-900">No Events Available</h3>
                                <p className="text-base text-gray-500 text-center max-w-sm font-medium">
                                    There are no event types available for booking at the moment.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        eventTypes.map((eventType) => (
                            <Card
                                key={eventType.id}
                                className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                                onClick={() => navigate(`/book/${eventType.slug}`)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex items-stretch">
                                        {/* Color Accent Bar */}
                                        <div className="w-1.5 bg-blue-500 group-hover:bg-blue-600 transition-colors duration-300" />

                                        {/* Content */}
                                        <div className="flex-1 p-5 flex items-center justify-between">
                                            <div className="space-y-1.5">
                                                <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {eventType.title}
                                                </h3>
                                                {eventType.description && (
                                                    <p className="text-sm text-gray-500 line-clamp-1 max-w-md">
                                                        {eventType.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 pt-1">
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {eventType.duration} min
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Arrow Icon */}
                                            <div className="ml-4 flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300">
                                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Footer Link */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        Powered by{' '}
                        <span
                            onClick={() => navigate('/')}
                            className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                            Cal.ai
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
