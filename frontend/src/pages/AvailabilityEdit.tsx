import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    Pencil,
    Trash2,
    Plus,
    Copy,
    Info,
    Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { availabilityApi } from '@/lib/api';
import { format, parseISO } from 'date-fns';

const DAYS = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const timeValue = `${hour.toString().padStart(2, '0')}:${minute}:00`;
    const ampm = hour < 12 ? 'am' : 'pm';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return {
        value: timeValue,
        label: `${displayHour}:${minute}${ampm}`,
    };
});

const TIMEZONES = [
    { label: 'Europe/London GMT +1:00', value: 'Europe/London' },
    { label: 'Asia/Kolkata GMT +5:30', value: 'Asia/Kolkata' },
    { label: 'America/New_York GMT -4:00', value: 'America/New_York' },
    { label: 'America/Los_Angeles GMT -7:00', value: 'America/Los_Angeles' },
    { label: 'Atlantic/Canary GMT +0:00', value: 'Atlantic/Canary' },
    { label: 'Africa/Banjul GMT +0:00', value: 'Africa/Banjul' },
    { label: 'Africa/Lome GMT +0:00', value: 'Africa/Lome' },
    { label: 'Europe/Tirane GMT +1:00', value: 'Europe/Tirane' },
    { label: 'Africa/Algiers GMT +1:00', value: 'Africa/Algiers' },
];

export function AvailabilityEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [availability, setAvailability] = useState<any[]>([]);
    const [overrides, setOverrides] = useState<any[]>([]);
    const [timezone, setTimezone] = useState('Europe/London');
    const [scheduleName, setScheduleName] = useState('Working hours');
    const [isDefault, setIsDefault] = useState(false);

    // Override Dialog State
    const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
    const [newOverrideDate, setNewOverrideDate] = useState('');
    const [newOverrideStart, setNewOverrideStart] = useState('09:00:00');
    const [newOverrideEnd, setNewOverrideEnd] = useState('17:00:00');
    const [newOverrideEnabled, setNewOverrideEnabled] = useState(true); // Default to available
    const [createOverrideLoading, setCreateOverrideLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const response = await availabilityApi.getById(id);
                // Ensure availability slots match our logic structure
                // Assuming backend returns { ...schedule, availability: [...] }
                const schedule = response.data;
                setScheduleName(schedule.name);
                setTimezone(schedule.timeZone);
                setIsDefault(schedule.isDefault);

                // We need to ensure we have slots for all days or map existing ones
                // Backend returns "availability" array
                if (schedule.availability && schedule.availability.length > 0) {
                    setAvailability(schedule.availability);
                } else {
                    // Fallback if no slots (shouldn't happen with new backend create logic)
                    setAvailability([]);
                }

                if (schedule.overrides) {
                    setOverrides(schedule.overrides);
                }

            } catch (error) {
                console.error('Failed to fetch schedule:', error);
                // navigate('/availability'); // Optional: redirect on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleToggleDay = (dayId: number) => {
        setAvailability(prev => {
            const daySlots = prev.filter(s => s.dayOfWeek === dayId);
            if (daySlots.length === 0) {
                // If no slots exist for this day, create one
                const newSlot = {
                    id: `new-${Date.now()}`,
                    dayOfWeek: dayId,
                    startTime: '09:00:00',
                    endTime: '17:00:00',
                    isEnabled: true
                };
                return [...prev, newSlot];
            }

            const areAllEnabled = daySlots.every(s => s.isEnabled);
            const newState = !areAllEnabled;
            // Toggle all slots for this day
            return prev.map(slot =>
                slot.dayOfWeek === dayId ? { ...slot, isEnabled: newState } : slot
            );
        });
    };

    const handleTimeChange = (slotId: string, field: 'startTime' | 'endTime', value: string) => {
        setAvailability(prev => prev.map(slot =>
            slot.id === slotId ? { ...slot, [field]: value } : slot
        ));
    };

    const handleAddRange = (dayId: number) => {
        const newSlot = {
            id: `new-${Date.now()}`,
            dayOfWeek: dayId,
            startTime: '09:00:00',
            endTime: '17:00:00',
            isEnabled: true
        };
        setAvailability(prev => [...prev, newSlot]);
    };

    const handleRemoveRange = (slotId: string) => {
        setAvailability(prev => {
            return prev.filter(slot => slot.id !== slotId);
        });
    };

    const handleSave = async () => {
        if (!id) return;
        setSaving(true);
        try {
            await Promise.all([
                // Update slots
                availabilityApi.updateSlots(id, availability.map(slot => ({
                    dayOfWeek: slot.dayOfWeek,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isEnabled: slot.isEnabled
                }))),
                // Update metadata (name, timezone, default)
                availabilityApi.update(id, {
                    name: scheduleName,
                    timeZone: timezone,
                    isDefault
                })
            ]);
            navigate('/availability');
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !window.confirm('Are you sure you want to delete this schedule?')) return;
        setSaving(true);
        try {
            await availabilityApi.delete(id);
            navigate('/availability');
        } catch (error) {
            console.error('Failed to delete:', error);
            setSaving(false);
        }
    };

    const handleCreateOverride = async () => {
        if (!id || !newOverrideDate) return;
        setCreateOverrideLoading(true);
        try {
            const response = await availabilityApi.createOverride(id, {
                date: newOverrideDate,
                startTime: newOverrideStart,
                endTime: newOverrideEnd,
                isEnabled: newOverrideEnabled
            });
            setOverrides([...overrides, response.data]);
            setOverrideDialogOpen(false);
            // Reset form
            setNewOverrideDate('');
            setNewOverrideStart('09:00:00');
            setNewOverrideEnd('17:00:00');
            setNewOverrideEnabled(true);
        } catch (error) {
            console.error('Failed to create override:', error);
        } finally {
            setCreateOverrideLoading(false);
        }
    };

    const handleDeleteOverride = async (overrideId: string) => {
        if (!window.confirm('Delete this date override?')) return;
        try {
            await availabilityApi.deleteOverride(overrideId);
            setOverrides(overrides.filter(o => o.id !== overrideId));
        } catch (error) {
            console.error('Failed to delete override:', error);
        }
    };

    const formatTimeLabel = (timeStr: string) => {
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayH = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayH}:${m}${ampm}`;
    };

    const formatDateLabel = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'EEE, d MMM');
        } catch {
            return dateStr;
        }
    };

    if (loading) return (
        <div className="p-8">
            <div className="animate-pulse space-y-4">
                <div className="h-10 bg-secondary rounded w-1/3"></div>
                <div className="h-64 bg-secondary rounded"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-background border-b border-border/60 mb-6 lg:top-0 top-14">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/availability')}
                            className="rounded-md hover:bg-secondary h-8 w-8"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-[15px] font-semibold tracking-tight">{scheduleName}</h1>
                                <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-transparent">
                                    <Pencil className="w-3 h-3 text-muted-foreground/60 hover:text-foreground transition-colors" />
                                </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground/70 font-medium">Mon - Fri, 9:00 AM - 5:00 PM</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-3 mr-1">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline">Set as default</span>
                            <Switch checked={isDefault} onCheckedChange={setIsDefault} />
                        </div>
                        <Separator orientation="vertical" className="h-6 sm:mx-2 bg-border/40" />
                        <Button onClick={handleDelete} variant="ghost" size="icon" className="h-9 w-9 rounded-md border border-border/50 hover:bg-destructive/10 hover:text-destructive group transition-all hidden sm:flex">
                            <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                        </Button>
                        <Separator orientation="vertical" className="h-6 sm:mx-2 bg-border/40 hidden sm:block" />
                        <Button onClick={handleSave} disabled={saving} className="h-9 gap-2 px-3 sm:px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-md">
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-6 lg:gap-10">
                <div className="flex-1 space-y-6">
                    {/* Weekly Schedule Card */}
                    <Card className="border-border/60 shadow-none overflow-hidden bg-transparent rounded-xl">
                        <CardContent className="p-0">
                            {DAYS.map((day, idx) => {
                                const daySlots = availability.filter(s => s.dayOfWeek === day.id);
                                const isDayEnabled = daySlots.some(s => s.isEnabled);

                                return (
                                    <div
                                        key={day.id}
                                        className={`flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5 transition-colors ${idx !== DAYS.length - 1 ? 'border-b border-border/50' : ''
                                            } ${!isDayEnabled ? 'bg-secondary/5 opacity-70' : 'bg-transparent'}`}
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-44 sm:mt-1">
                                            <Switch
                                                checked={isDayEnabled}
                                                onCheckedChange={() => handleToggleDay(day.id)}
                                            />
                                            <Label
                                                className={`text-sm font-semibold cursor-pointer select-none transition-colors ${isDayEnabled ? 'text-foreground' : 'text-muted-foreground/50'}`}
                                                onClick={() => handleToggleDay(day.id)}
                                            >
                                                {day.name}
                                            </Label>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            {isDayEnabled ? (
                                                <div className="space-y-3">
                                                    {daySlots.filter(s => s.isEnabled).map((slot, sIdx) => (
                                                        <div key={slot.id} className="flex flex-wrap items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <Select
                                                                    value={slot.startTime}
                                                                    onValueChange={(val) => handleTimeChange(slot.id, 'startTime', val)}
                                                                >
                                                                    <SelectTrigger className="w-[100px] h-9 text-sm font-medium border-border/60 bg-transparent hover:bg-secondary/20 transition-all rounded-md">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="max-h-[300px] bg-popover border-border">
                                                                        {TIME_OPTIONS.map(opt => (
                                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                                {opt.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <span className="text-muted-foreground/50 text-xs px-1">—</span>
                                                                <Select
                                                                    value={slot.endTime}
                                                                    onValueChange={(val) => handleTimeChange(slot.id, 'endTime', val)}
                                                                >
                                                                    <SelectTrigger className="w-[100px] h-9 text-sm font-medium border-border/60 bg-transparent hover:bg-secondary/20 transition-all rounded-md">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="max-h-[300px] bg-popover border-border">
                                                                        {TIME_OPTIONS.map(opt => (
                                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                                {opt.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="flex items-center">
                                                                {sIdx === 0 && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 rounded-md hover:bg-secondary/40 text-muted-foreground"
                                                                        onClick={() => handleAddRange(day.id)}
                                                                    >
                                                                        <Plus className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                )}
                                                                {daySlots.filter(s => s.isEnabled).length > 1 && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                                                        onClick={() => handleRemoveRange(slot.id)}
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                )}
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-secondary/40 text-muted-foreground ml-1">
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="h-9 flex items-center">
                                                    <span className="text-sm text-muted-foreground font-medium">Unavailable</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <div className="pt-6 border border-border/60 rounded-xl p-6 bg-transparent">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground text-sm">Date overrides <Info className="inline w-3 h-3 text-muted-foreground/60 ml-0.5" /></h3>
                        </div>
                        <p className="text-[13px] text-muted-foreground mb-4">
                            Add dates when your availability changes from your daily hours.
                        </p>

                        <div className="space-y-3 mb-4">
                            {overrides.map(override => (
                                <div key={override.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-secondary/10">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 font-medium text-sm">
                                            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                            {formatDateLabel(override.date)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {override.isEnabled
                                                ? `${formatTimeLabel(override.startTime)} - ${formatTimeLabel(override.endTime)}`
                                                : <span className="text-destructive/80 font-medium">Unavailable</span>
                                            }
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:text-destructive"
                                        onClick={() => handleDeleteOverride(override.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            className="gap-2 border-border/60 h-9 px-4 rounded-md text-sm font-medium hover:bg-secondary/40"
                            onClick={() => setOverrideDialogOpen(true)}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add an override
                        </Button>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="w-full md:w-[280px] shrink-0 space-y-6">
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-muted-foreground ml-0.5">Timezone</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                            <SelectTrigger className="w-full h-9 border-border/60 bg-transparent hover:bg-secondary/20 transition-all rounded-md text-[13px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[400px] bg-popover border-border">
                                {TIMEZONES.map(tz => (
                                    <SelectItem key={tz.value} value={tz.value} className="text-[13px]">{tz.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator className="border-border/30" />

                    <div className="p-4 rounded-xl border border-border/60 bg-transparent">
                        <h4 className="text-[13px] font-semibold mb-3 text-foreground">Something doesn't look right?</h4>
                        <Button variant="outline" className="w-full h-8 text-[11px] font-semibold border-border/60 bg-background hover:bg-secondary/20 transition-all rounded-md">
                            Launch troubleshooter
                        </Button>
                    </div>
                </aside>
            </main>

            {/* Add Override Dialog */}
            <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add specific date</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="date">Select date</Label>
                            {/* Native date picker for simplicity and robustness across overrides */}
                            <Input
                                id="date"
                                type="date"
                                value={newOverrideDate}
                                onChange={(e) => setNewOverrideDate(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <Switch
                                id="available"
                                checked={newOverrideEnabled}
                                onCheckedChange={setNewOverrideEnabled}
                            />
                            <Label htmlFor="available" className="cursor-pointer">Available on this date</Label>
                        </div>

                        {newOverrideEnabled && (
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="flex flex-col gap-2">
                                    <Label>Start time</Label>
                                    <Select value={newOverrideStart} onValueChange={setNewOverrideStart}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]">
                                            {TIME_OPTIONS.map(opt => (
                                                <SelectItem key={`start-${opt.value}`} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>End time</Label>
                                    <Select value={newOverrideEnd} onValueChange={setNewOverrideEnd}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]">
                                            {TIME_OPTIONS.map(opt => (
                                                <SelectItem key={`end-${opt.value}`} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOverrideDialogOpen(false)}
                            disabled={createOverrideLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateOverride}
                            disabled={!newOverrideDate || createOverrideLoading}
                        >
                            {createOverrideLoading ? 'Adding...' : 'Add Override'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
