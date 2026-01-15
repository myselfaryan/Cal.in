import { Zap, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const calAITemplates = [
    {
        icon: Phone,
        title: 'Call to confirm booking',
        description: '2 hrs before event starts',
        color: 'bg-purple-500/20',
        iconColor: 'text-purple-500',
    },
    {
        icon: Phone,
        title: 'Follow up with no shows',
        description: '30m after event ends',
        color: 'bg-purple-500/20',
        iconColor: 'text-purple-500',
    },
    {
        icon: Phone,
        title: 'Remind attendees to bring ID',
        description: '1 day before event starts',
        color: 'bg-purple-500/20',
        iconColor: 'text-purple-500',
    },
];

const standardTemplates = [
    {
        icon: MessageSquare,
        title: 'Send SMS reminder',
        description: '24 hours before event starts',
    },
    {
        icon: Phone,
        title: 'Follow up with no shows',
        description: '30m after event ends',
    },
    {
        icon: Phone,
        title: 'Remind attendees to bring ID',
        description: '1 day before event starts',
    },
    {
        icon: Mail,
        title: 'Email reminder',
        description: '1 hour before event starts',
    },
    {
        icon: Mail,
        title: 'Custom email reminder',
        description: 'Event is rescheduled to host',
    },
    {
        icon: MessageSquare,
        title: 'Custom SMS reminder',
        description: 'When event is scheduled',
    },
];

export function WorkflowsPage() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Workflows</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create workflows to automate notifications and reminders
                    </p>
                </div>
                <Button className="gap-2">
                    + New
                </Button>
            </div>

            {/* Empty State with Icon */}
            <div className="flex flex-col items-center justify-center py-12 mb-8">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                    <Zap className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Workflows</h2>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                    Workflows enable simple automation to send notifications & reminders enabling you to build processes around your events.
                </p>
                <Button variant="outline" className="gap-2">
                    + Create a workflow
                </Button>
            </div>

            {/* Cal.ai Templates */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Cal.ai templates</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {calAITemplates.map((template, index) => (
                        <Card key={index} className="hover:border-muted-foreground/50 transition-colors cursor-pointer bg-secondary/50">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${template.color} flex items-center justify-center`}>
                                        <template.icon className={`w-4 h-4 ${template.iconColor}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">{template.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Standard Templates */}
            <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Standard templates</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {standardTemplates.map((template, index) => (
                        <Card key={index} className="hover:border-muted-foreground/50 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                        <template.icon className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">{template.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
