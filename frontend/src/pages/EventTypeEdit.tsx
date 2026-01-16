import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ExternalLink,
    Link2,
    Code,
    Trash2,
    Clock,
    Calendar,
    Settings2,
    Repeat,
    LayoutGrid,
    Zap,
    Globe,
    User,
    ChevronRight,
    Bold,
    Italic,
    Link as LinkIcon,
    Plus,
    HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { eventTypesApi } from '@/lib/api';

interface EventType {
    id: string;
    title: string;
    description: string;
    duration: number;
    slug: string;
    createdAt: string;
    bookingFields?: any[];
}

const sidebarItems = [
    { id: 'basics', title: 'Basics', icon: User, description: '30 mins' },
    { id: 'questions', title: 'Booking Questions', icon: HelpCircle, description: 'Ask questions on booking' },
    { id: 'availability', title: 'Availability', icon: Calendar, description: 'Working hours' },
    { id: 'limits', title: 'Limits', icon: Clock, description: 'How often you can be booked' },
    { id: 'advanced', title: 'Advanced', icon: Settings2, description: 'Calendar settings & more...' },
    { id: 'recurring', title: 'Recurring', icon: Repeat, description: 'Set up a repeating schedule' },
    { id: 'apps', title: 'Apps', icon: LayoutGrid, description: '0 apps, 0 active' },
    { id: 'workflows', title: 'Workflows', icon: Zap, description: '0 active' },
    { id: 'webhooks', title: 'Webhooks', icon: Globe, description: '0 active' },
];

export function EventTypeEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('basics');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventType, setEventType] = useState<EventType | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '30',
        slug: '',
        bookingFields: [] as any[],
    });

    useEffect(() => {
        const fetchEventType = async () => {
            if (!id) return;
            try {
                const response = await eventTypesApi.getById(id);
                const data = response.data;
                setEventType(data);
                setFormData({
                    title: data.title,
                    description: data.description || '',
                    duration: data.duration.toString(),
                    slug: data.slug,
                    bookingFields: data.bookingFields || [],
                });
            } catch (error) {
                console.error('Failed to fetch event type:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventType();
    }, [id]);

    const handleSave = async () => {
        if (!id) return;
        try {
            await eventTypesApi.update(id, {
                ...formData,
                duration: parseInt(formData.duration),
            });
            // navigate('/event-types'); // Don't navigate, show succcess?
        } catch (error) {
            console.error('Failed to update event type:', error);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        try {
            await eventTypesApi.delete(id);
            navigate('/event-types');
        } catch (error) {
            console.error('Failed to delete event type:', error);
        }
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            bookingFields: [
                ...prev.bookingFields,
                {
                    id: `field-${Date.now()}`,
                    label: '',
                    type: 'text',
                    required: true,
                    placeholder: '',
                },
            ],
        }));
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newFields = [...formData.bookingFields];
        newFields[index] = { ...newFields[index], [field]: value };
        setFormData(prev => ({ ...prev, bookingFields: newFields }));
    };

    const removeQuestion = (index: number) => {
        const newFields = [...formData.bookingFields];
        newFields.splice(index, 1);
        setFormData(prev => ({ ...prev, bookingFields: newFields }));
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-secondary rounded w-1/4"></div>
                    <div className="h-64 bg-secondary rounded"></div>
                </div>
            </div>
        );
    }

    if (!eventType) {
        return <div className="p-8">Event type not found.</div>;
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Top Navigation */}
            <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-background sticky top-14 lg:top-0 z-40">
                <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/event-types')} className="flex-shrink-0">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">{formData.title}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 mr-4">
                        <Toggle
                            defaultPressed
                            variant="outline"
                            size="sm"
                            className="h-8 gap-2 data-[state=on]:bg-emerald-500/10 data-[state=on]:text-emerald-500 data-[state=on]:border-emerald-500/50"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Active
                        </Toggle>
                    </div>
                    <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
                    <div className="hidden md:flex items-center gap-1">
                        <Button variant="ghost" size="icon" title="Preview">
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Link">
                            <Link2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Embed">
                            <Code className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" title="Delete" className="text-destructive hidden sm:flex" onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
                    <Button onClick={handleSave} className="px-4 sm:px-6 font-medium h-9 text-sm">Save</Button>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Sidebar / Sub-nav */}
                <aside className="w-full lg:w-80 border-b lg:border-r border-border p-2 sm:p-4 bg-background overflow-x-auto">
                    <nav className="flex lg:flex-col space-x-1 lg:space-x-0 lg:space-y-1">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex-shrink-0 flex items-center lg:items-start gap-3 lg:gap-4 p-2 sm:p-3 rounded-lg transition-colors text-left ${isActive
                                        ? 'bg-secondary text-foreground ring-1 ring-border'
                                        : 'text-muted-foreground hover:bg-secondary/50'
                                        }`}
                                >
                                    <div className={`p-1 rounded ${isActive ? 'text-primary' : ''}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm whitespace-nowrap">{item.title}</span>
                                            {isActive && <ChevronRight className="w-4 h-4 text-muted-foreground hidden lg:block" />}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground truncate mt-0.5 hidden lg:block">{item.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-background/50">
                    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
                        {/* Basics Section */}
                        {activeTab === 'basics' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="30 min meeting"
                                        className="h-10 text-base"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                    <div className="border border-input rounded-md overflow-hidden bg-background">
                                        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/20">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><LinkIcon className="w-4 h-4" /></Button>
                                        </div>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="A quick video meeting."
                                            rows={4}
                                            className="border-0 focus-visible:ring-0 rounded-none resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="text-sm font-medium">URL</Label>
                                    <div className="flex items-center border border-input rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring h-10 px-3">
                                        <span className="text-sm text-muted-foreground py-2 mr-0.5 select-none">cal.com/jhantu/</span>
                                        <input
                                            id="slug"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            placeholder="30min"
                                            className="flex-1 h-full bg-transparent border-0 focus:outline-none focus:ring-0 text-sm py-2"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <Input
                                                id="duration"
                                                type="number"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                className="h-10"
                                            />
                                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                <span className="text-sm text-neutral-400">Minutes</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4 pt-2">
                                        <Toggle
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                        >
                                            Allow multiple durations
                                        </Toggle>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                                    <Select defaultValue="cal-video">
                                        <SelectTrigger className="h-12 bg-background">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-muted-foreground/20 rounded flex items-center justify-center">
                                                    <Globe className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <SelectValue placeholder="Cal Video (Default)" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cal-video">Cal Video (Default)</SelectItem>
                                            <SelectItem value="google-meet">Google Meet</SelectItem>
                                            <SelectItem value="zoom">Zoom</SelectItem>
                                            <SelectItem value="phone">Phone call</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2 flex items-center gap-1">
                                        Show advanced settings <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>

                                <Button variant="outline" className="w-full mt-4 h-12 dashed border-dashed border-2 hover:bg-secondary/50">
                                    <Plus className="w-4 h-4 mr-2" /> Add a location
                                </Button>
                            </div>
                        )}

                        {/* Questions Section */}
                        {activeTab === 'questions' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-medium">Booking Questions</h2>
                                        <p className="text-sm text-muted-foreground">
                                            What information do you need from people booking with you?
                                        </p>
                                    </div>
                                    <Button onClick={addQuestion} variant="outline" size="sm" className="gap-2">
                                        <Plus className="w-4 h-4" /> Add Question
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {formData.bookingFields.map((field, index) => (
                                        <div key={field.id} className="p-4 rounded-lg border border-border bg-card">
                                            <div className="grid gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-1 space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Label</Label>
                                                                <Input
                                                                    value={field.label}
                                                                    onChange={(e) => updateQuestion(index, 'label', e.target.value)}
                                                                    placeholder="e.g. Phone Number"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Input Type</Label>
                                                                <Select
                                                                    value={field.type}
                                                                    onValueChange={(val) => updateQuestion(index, 'type', val)}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="text">Text (One line)</SelectItem>
                                                                        <SelectItem value="textarea">Text (Multi line)</SelectItem>
                                                                        <SelectItem value="number">Number</SelectItem>
                                                                        <SelectItem value="email">Email</SelectItem>
                                                                        <SelectItem value="phone">Phone</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <Switch
                                                                    checked={field.required}
                                                                    onCheckedChange={(checked) => updateQuestion(index, 'required', checked)}
                                                                />
                                                                <span className="text-sm text-muted-foreground">Required</span>
                                                            </div>
                                                            <Input
                                                                value={field.placeholder || ''}
                                                                onChange={(e) => updateQuestion(index, 'placeholder', e.target.value)}
                                                                placeholder="Placeholder text (optional)"
                                                                className="flex-1"
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-destructive"
                                                        onClick={() => removeQuestion(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {formData.bookingFields.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-lg border border-dashed border-border/50">
                                            No custom questions added yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Other sections can be implemented similarly if needed */}
                        {activeTab !== 'basics' && activeTab !== 'questions' && (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                                    <Settings2 className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">{sidebarItems.find(i => i.id === activeTab)?.title} settings</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        This section is currently under development. You can edit the basics for now.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

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
