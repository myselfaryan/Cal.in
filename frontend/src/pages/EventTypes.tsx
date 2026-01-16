import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, Link2, Pencil, Trash2, Copy, MoreHorizontal, ExternalLink, Code, Search } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { eventTypesApi } from '@/lib/api';

interface EventType {
    id: string;
    title: string;
    description: string;
    duration: number;
    slug: string;
    enabled: boolean;
    createdAt: string;
}

export function EventTypesPage() {
    const navigate = useNavigate();
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);
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
        navigate(`/event-types/edit/${event.id}`);
    };

    const handleDelete = async () => {
        if (!eventToDelete) return;
        try {
            await eventTypesApi.delete(eventToDelete);
            setDeleteDialogOpen(false);
            setEventToDelete(null);
            fetchEventTypes();
        } catch (error) {
            console.error('Failed to delete event type:', error);
        }
    };

    const handleToggleEnabled = async (id: string, enabled: boolean) => {
        try {
            await eventTypesApi.update(id, { enabled });
            setEventTypes(prev => prev.map(ev => ev.id === id ? { ...ev, enabled } : ev));
        } catch (error) {
            console.error('Failed to toggle event type:', error);
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
        <div className="p-4 sm:p-8 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Event types</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Configure different events for people to book on your calendar.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search"
                            className="w-64 pl-9 bg-secondary/20 border-border/40 focus:bg-background transition-all rounded-lg h-9"
                        />
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
                <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
                    {eventTypes.map((event, idx) => (
                        <div
                            key={event.id}
                            className={`group relative hover:bg-secondary/10 transition-all duration-200 cursor-pointer ${idx !== eventTypes.length - 1 ? 'border-b border-border/60' : ''
                                }`}
                            onClick={(e) => {
                                // Only navigate if we're not clicking an action button
                                const isAction = (e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('[role="switch"]');
                                if (!isAction) {
                                    handleEdit(event);
                                }
                            }}
                        >
                            <CardContent className="p-0">
                                <div className="flex items-center justify-between p-4 sm:p-5">
                                    <div className="flex flex-col gap-1.5 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                            <h3 className="font-bold text-[15px] text-foreground group-hover:text-primary transition-colors truncate">
                                                {event.title}
                                            </h3>
                                            <span className="text-xs text-muted-foreground font-medium truncate opacity-60">
                                                /book/{event.slug}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary" className="text-[10px] font-bold py-0.5 h-5 px-1.5 bg-secondary/50 text-muted-foreground border-transparent">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {event.duration}m
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 relative z-10">
                                        <div className="flex items-center gap-3 mr-2">
                                            {!event.enabled && <span className="text-[11px] font-medium text-muted-foreground/60 mr-1">Disabled</span>}
                                            <Switch
                                                checked={event.enabled}
                                                onCheckedChange={(checked) => {
                                                    handleToggleEnabled(event.id, checked);
                                                }}
                                                className="data-[state=checked]:bg-white data-[state=checked]:border-white"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 border border-border/40 rounded-lg p-0.5 bg-secondary/20">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-md hover:bg-background transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(`/book/${event.slug}`, '_blank');
                                                }}
                                                title="Preview"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-md hover:bg-background transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopyLink(event.slug);
                                                }}
                                                title="Copy link"
                                            >
                                                <Link2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-md hover:bg-background transition-all"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <MoreHorizontal className="w-3.5 h-3.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(event);
                                                    }}>
                                                        <Pencil className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Duplicate logic
                                                        alert('Duplicate feature coming soon');
                                                    }}>
                                                        <Copy className="w-4 h-4 mr-2" />
                                                        Duplicate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Embed logic
                                                        alert('Embed feature coming soon');
                                                    }}>
                                                        <Code className="w-4 h-4 mr-2" />
                                                        Embed
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEventToDelete(event.id);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    ))}
                </div>
            )}
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <Trash2 className="w-6 h-6 text-destructive" />
                        </div>
                        <DialogTitle>Delete event type?</DialogTitle>
                        <DialogDescription>
                            Anyone who've shared this link with will no longer be able to book using it.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete event type
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
