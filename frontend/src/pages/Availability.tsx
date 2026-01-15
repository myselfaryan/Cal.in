import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { availabilityApi } from '@/lib/api';

interface AvailabilitySlot {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isEnabled: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const timeValue = `${hour.toString().padStart(2, '0')}:${minute}:00`;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return {
        value: timeValue,
        label: `${displayHour}:${minute} ${ampm}`,
    };
});

const TIMEZONES = [
    'Asia/Kolkata',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney',
    'UTC',
];

export function AvailabilityPage() {
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
    const [timezone, setTimezone] = useState('Asia/Kolkata');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [availabilityRes, timezoneRes] = await Promise.all([
                availabilityApi.getAll(),
                availabilityApi.getTimezone(),
            ]);
            setAvailability(availabilityRes.data);
            setTimezone(timezoneRes.data.timezone);
        } catch (error) {
            console.error('Failed to fetch availability:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDay = (dayOfWeek: number) => {
        setAvailability((prev) =>
            prev.map((slot) =>
                slot.dayOfWeek === dayOfWeek ? { ...slot, isEnabled: !slot.isEnabled } : slot
            )
        );
        setHasChanges(true);
    };

    const handleTimeChange = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
        setAvailability((prev) =>
            prev.map((slot) =>
                slot.dayOfWeek === dayOfWeek ? { ...slot, [field]: value } : slot
            )
        );
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await Promise.all([
                availabilityApi.bulkUpdate(
                    availability.map((slot) => ({
                        id: slot.id,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        isEnabled: slot.isEnabled,
                    }))
                ),
                availabilityApi.updateTimezone(timezone),
            ]);
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to save availability:', error);
        } finally {
            setSaving(false);
        }
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

    const getSlotByDay = (dayOfWeek: number) =>
        availability.find((slot) => slot.dayOfWeek === dayOfWeek);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Availability</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Configure times when you are available for bookings.
                    </p>
                </div>
                {hasChanges && (
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        <Check className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                )}
            </div>

            <div className="grid gap-6">
                {/* Timezone Setting */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Timezone</CardTitle>
                        <CardDescription>
                            Set your timezone for accurate availability display.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={timezone}
                            onValueChange={(value) => {
                                setTimezone(value);
                                setHasChanges(true);
                            }}
                        >
                            <SelectTrigger className="w-[300px]">
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                {TIMEZONES.map((tz) => (
                                    <SelectItem key={tz} value={tz}>
                                        {tz}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Weekly Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Weekly Hours</CardTitle>
                        <CardDescription>
                            Set your regular weekly hours for availability.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {DAYS.map((day, index) => {
                            const slot = getSlotByDay(index);
                            if (!slot) return null;

                            return (
                                <div
                                    key={day}
                                    className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                                >
                                    <div className="flex items-center gap-3 w-32">
                                        <Switch
                                            checked={slot.isEnabled}
                                            onCheckedChange={() => handleToggleDay(index)}
                                        />
                                        <Label className={slot.isEnabled ? 'text-foreground' : 'text-muted-foreground'}>
                                            {day}
                                        </Label>
                                    </div>

                                    {slot.isEnabled ? (
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={slot.startTime}
                                                onValueChange={(value) => handleTimeChange(index, 'startTime', value)}
                                            >
                                                <SelectTrigger className="w-[130px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TIME_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <span className="text-muted-foreground">-</span>
                                            <Select
                                                value={slot.endTime}
                                                onValueChange={(value) => handleTimeChange(index, 'endTime', value)}
                                            >
                                                <SelectTrigger className="w-[130px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TIME_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Unavailable</span>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
