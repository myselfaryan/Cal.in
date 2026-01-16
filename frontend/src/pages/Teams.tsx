import { Plus, Users, Repeat, UserPlus, Mail, Video, EyeOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
    {
        title: "Collective scheduling",
        description: "Make it easy to book your team when everyone is available.",
        icon: Users,
        iconColor: "text-red-500",
    },
    {
        title: "Round robin",
        description: "Find the best person available and cycle through your team.",
        icon: Repeat,
        iconColor: "text-blue-500",
    },
    {
        title: "Fixed round robin",
        description: "Add one fixed attendee and round robin through a number of attendees.",
        icon: UserPlus,
        iconColor: "text-green-500",
    },
    {
        title: "Send SMS to attendee",
        description: "Easily send meeting reminders via SMS to your attendees.",
        icon: Mail,
        iconColor: "text-orange-500",
    },
    {
        title: "Cal Video Recordings",
        description: "Recordings are only available as part of our teams plan. Upgrade to start recording your calls.",
        icon: Video,
        iconColor: "text-purple-500",
    },
    {
        title: "Disable Cal.in branding",
        description: "Hide all Cal.in branding from your public pages.",
        icon: EyeOff,
        iconColor: "text-indigo-500",
    },
];

export function TeamsPage() {
    return (
        <div className="p-4 sm:p-8 max-w-[1200px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Teams</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create and manage teams to use collaborative features.
                    </p>
                </div>
                <Button className="gap-2 sm:w-auto w-full">
                    <Plus className="w-4 h-4" />
                    New
                </Button>
            </div>

            {/* Hero Card */}
            <Card className="overflow-hidden border-none bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] relative ring-1 ring-white/10">
                <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className="p-8 md:p-12 flex-1 z-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Cal.in is better with teams</h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-md">
                            Add your team members to your event types. Use collective scheduling to include everyone or find the most suitable person with round robin scheduling.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button className="bg-white text-black hover:bg-white/90 font-semibold px-6">
                                Create team
                            </Button>
                            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                                Learn more
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 relative min-h-[300px] md:min-h-0 bg-[#111] overflow-hidden">
                        {/* Illustration Mockup */}
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <img
                                src="/assets/teams-illustration.png"
                                alt="Teams Illustration"
                                className="w-full h-auto object-contain rounded-lg shadow-2xl scale-110 sm:scale-100"
                                onError={(e) => {
                                    // Fallback if image doesn't exist yet, using a placeholder style
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000";
                                }}
                            />
                        </div>
                        {/* Decorative gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent hidden md:block" />
                    </div>
                </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <Card key={index} className="bg-secondary/20 border-border/40 hover:bg-secondary/30 transition-all cursor-pointer group">
                        <CardContent className="p-6">
                            <div className={`${feature.iconColor} mb-4 p-2 rounded-lg bg-background/50 inline-block ring-1 ring-white/5`}>
                                <feature.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-[17px] font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Footer Tip */}
            <div className="flex items-center gap-2 text-muted-foreground justify-center py-4 bg-secondary/10 rounded-xl border border-border/40">
                <Info className="w-4 h-4" />
                <p className="text-xs sm:text-sm">
                    Tip: You can add a <span className="text-foreground font-medium">'+'</span> between usernames (e.g. cal.com/anna+brian) to meet with multiple people
                </p>
            </div>
        </div>
    );
}
