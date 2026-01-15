import { Link, useLocation } from 'react-router-dom';
import {
    Calendar,
    Clock,
    Link2,
    Settings,
    Zap,
    BarChart3,
    Users,
    ChevronDown,
    Search,
    ExternalLink,
    Copy,
    Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const mainNavItems = [
    { icon: Calendar, label: 'Event Types', path: '/event-types' },
    { icon: Clock, label: 'Bookings', path: '/bookings' },
    { icon: Link2, label: 'Availability', path: '/availability' },
    { icon: Users, label: 'Teams', path: '/teams' },
];

const secondaryNavItems = [
    { icon: Zap, label: 'Apps', path: '/apps', hasDropdown: true },
    { icon: Zap, label: 'Routing', path: '/routing' },
    { icon: Zap, label: 'Workflows', path: '/workflows' },
    { icon: BarChart3, label: 'Insights', path: '/insights' },
];

const bottomNavItems = [
    { icon: ExternalLink, label: 'View public page', path: '/public' },
    { icon: Copy, label: 'Copy public page link', action: 'copy' },
    { icon: Gift, label: 'Refer and earn', path: '/refer' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/event-types' && location.pathname === '/') return true;
        return location.pathname.startsWith(path);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.origin + '/book');
        // You could add a toast notification here
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] flex flex-col border-r border-border" style={{ background: 'hsl(0 0% 5%)' }}>
            {/* User Profile */}
            <div className="flex items-center gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-semibold">
                    I
                </div>
                <span className="text-sm font-medium text-foreground">Ione</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
                <button className="p-1.5 rounded hover:bg-secondary">
                    <Search className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-2 py-2 overflow-y-auto">
                <div className="space-y-1">
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn('sidebar-item', isActive(item.path) && 'active')}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <Separator className="my-3 bg-border" />

                <div className="space-y-1">
                    {secondaryNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn('sidebar-item', isActive(item.path) && 'active')}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                            {item.hasDropdown && <ChevronDown className="w-3 h-3 ml-auto" />}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Bottom Navigation */}
            <div className="px-2 py-3 border-t border-border">
                <div className="space-y-1">
                    {bottomNavItems.map((item) => (
                        item.action === 'copy' ? (
                            <button
                                key={item.label}
                                onClick={handleCopyLink}
                                className="sidebar-item w-full text-left"
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </button>
                        ) : (
                            <Link
                                key={item.path}
                                to={item.path!}
                                className="sidebar-item"
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    ))}
                </div>
            </div>
        </aside>
    );
}
