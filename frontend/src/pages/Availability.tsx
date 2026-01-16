import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, Globe, ArrowRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { availabilityApi } from '@/lib/api';



export function AvailabilityPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newScheduleName, setNewScheduleName] = useState('Working hours');

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await availabilityApi.getAll();
                if (response.data) {
                    setSchedules(response.data);
                } else {
                    setSchedules([]);
                }
            } catch (error) {
                console.error('Failed to fetch schedules:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

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

    const handleCreateSchedule = async () => {
        try {
            setLoading(true);
            const response = await availabilityApi.create({ name: newScheduleName });
            setDialogOpen(false);
            navigate(`/availability/edit/${response.data.id}`);
        } catch (error) {
            console.error('Failed to create schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Availability</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Configure times when you are available for bookings.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ToggleGroup type="single" defaultValue="my" className="bg-secondary/20 p-1 rounded-xl border border-border/40">
                        <ToggleGroupItem
                            value="my"
                            className="px-4 py-1.5 text-sm font-medium rounded-lg data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm transition-all"
                        >
                            My availability
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="team"
                            className="px-4 py-1.5 text-sm font-medium text-muted-foreground data-[state=on]:text-foreground data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-lg transition-all"
                        >
                            Team availability
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                New
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add a new schedule</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={newScheduleName}
                                        onChange={(e) => setNewScheduleName(e.target.value)}
                                        placeholder="Working hours"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setDialogOpen(false)}>Close</Button>
                                <Button onClick={handleCreateSchedule} disabled={loading}>
                                    {loading ? 'Creating...' : 'Continue'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content Area */}
            {schedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-dashed border-border/50 bg-secondary/5 mt-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
                        <Clock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Create an availability schedule</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm mb-8">
                        Creating availability schedules allows you to manage availability across event types. They can be applied to one or more event types.
                    </p>
                    <Button onClick={() => setDialogOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        New
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {schedules.map((schedule) => (
                        <Card
                            key={schedule.id}
                            className="group hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
                            onClick={() => navigate(`/availability/edit/${schedule.id}`)}
                        >
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <Clock className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-foreground">{schedule.name}</h3>
                                                {schedule.isDefault && (
                                                    <Badge variant="secondary" className="text-[10px] font-medium py-0 h-5 px-1.5">Default</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-0.5">{schedule.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                            <Globe className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="gap-1 px-2 border-border/50">
                                            Edit
                                            <ArrowRight className="w-3.5 h-3.5" />
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
