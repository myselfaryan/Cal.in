import { BarChart3, TrendingUp, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function InsightsPage() {
    return (
        <div className="p-4 sm:p-8 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View booking insights across your events
                    </p>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-secondary to-secondary/50 rounded-xl p-8 mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    <div className="max-w-md">
                        <h2 className="text-2xl font-bold mb-3">Make informed decisions with Insights</h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            Our Insights dashboard surfaces all activity across your team and shows you trends that enable better team scheduling and decision making.
                        </p>
                        <div className="flex gap-3">
                            <Button>Create team</Button>
                            <Button variant="outline">Learn more</Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Card className="flex-1 min-w-[140px]">
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground mb-1">Bookings</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl sm:text-3xl font-bold">32%</span>
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 min-w-[140px]">
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground mb-1">Most booked</p>
                                <div className="flex items-center gap-2">
                                    <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                                    <span className="text-2xl sm:text-3xl font-bold">321</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:border-muted-foreground/50 transition-colors cursor-pointer">
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mb-2">
                            <BarChart3 className="w-5 h-5 text-red-500" />
                        </div>
                        <CardTitle className="text-base">View bookings across all members</CardTitle>
                        <CardDescription>
                            See who's receiving the most bookings and ensure the best distribution across your team
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-muted-foreground/50 transition-colors cursor-pointer">
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <CardTitle className="text-base">Identify booking trends</CardTitle>
                        <CardDescription>
                            See what times of the week and what times during the day are popular for your bookers
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="hover:border-muted-foreground/50 transition-colors cursor-pointer">
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                        </div>
                        <CardTitle className="text-base">Spot popular event types</CardTitle>
                        <CardDescription>
                            See which of your event types are receiving the most clicks and bookings
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
