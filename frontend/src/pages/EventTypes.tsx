import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, Link2, Pencil, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { eventTypesApi } from '@/lib/api';

interface EventType {
    id: string;
    title: string;
    description: string;
    duration: number;
    slug: string;
    createdAt: string;
}

export function EventTypesPage() {
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '30',
        slug: '',
    });

    const fetchEventTypes = async () => {
        try {
            const response = await eventTypesApi.getAll();
            setEventTypes(response.data);
        } catch (error) {
            console.error('Failed to fetch event types:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventTypes();
    }, []);

    const handleSubmit = async () => {
        try {
            if (editingEvent) {
                await eventTypesApi.update(editingEvent.id, {
                    ...formData,
                    duration: parseInt(formData.duration),
                });
            } else {
                await eventTypesApi.create({
                    ...formData,
                    duration: parseInt(formData.duration),
                });
            }
            setDialogOpen(false);
            setEditingEvent(null);
            setFormData({ title: '', description: '', duration: '30', slug: '' });
            fetchEventTypes();
        } catch (error) {
            console.error('Failed to save event type:', error);
        }
    };

    const handleEdit = (event: EventType) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            duration: event.duration.toString(),
            slug: event.slug,
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this event type?')) {
            try {
                await eventTypesApi.delete(id);
                fetchEventTypes();
            } catch (error) {
                console.error('Failed to delete event type:', error);
            }
        }
    };

    const handleCopyLink = (slug: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/book/${slug}`);
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-secondary rounded w-1/4"></div>
                    <div className="h-32 bg-secondary rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Event Types</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create events to share for people to book on your calendar.
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                        setEditingEvent(null);
                        setFormData({ title: '', description: '', duration: '30', slug: '' });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            New
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingEvent ? 'Edit Event Type' : 'Add a new event type'}</DialogTitle>
                            <DialogDescription>
                                Create a new event type for people to book time with you.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                            slug: editingEvent ? formData.slug : generateSlug(e.target.value),
                                        });
                                    }}
                                    placeholder="Quick Chat"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">URL Slug</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">/book/</span>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="quick-chat"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Select
                                    value={formData.duration}
                                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="45">45 minutes</SelectItem>
                                        <SelectItem value="60">60 minutes</SelectItem>
                                        <SelectItem value="90">90 minutes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="A quick call to discuss your needs."
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>
                                {editingEvent ? 'Save Changes' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Event Types Grid */}
            {eventTypes.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No event types yet</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            Create your first event type to start accepting bookings.
                        </p>
                        <Button onClick={() => setDialogOpen(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create Event Type
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {eventTypes.map((event) => (
                        <Card key={event.id} className="hover:border-muted-foreground/50 transition-colors">
                            <CardContent className="p-0">
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1 h-12 rounded-full bg-primary"></div>
                                        <div>
                                            <Link
                                                to={`/book/${event.slug}`}
                                                className="font-medium text-foreground hover:underline"
                                                target="_blank"
                                            >
                                                {event.title}
                                            </Link>
                                            <div className="flex items-center gap-3 mt-1">
                                                <Badge variant="secondary" className="text-xs font-normal">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {event.duration}m
                                                </Badge>
                                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Link2 className="w-3 h-3" />
                                                    /book/{event.slug}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopyLink(event.slug)}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(event)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(event.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
