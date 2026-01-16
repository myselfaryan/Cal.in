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
    LayoutGrid,
    GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const mainNavItems = [
    { icon: Link2, label: 'Event types', path: '/event-types' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    { icon: Clock, label: 'Availability', path: '/availability' },
    { icon: Users, label: 'Teams', path: '/teams' },
];

const secondaryNavItems = [
    { icon: LayoutGrid, label: 'Apps', path: '/apps', hasDropdown: true },
    { icon: GitBranch, label: 'Routing', path: '/routing' },
    { icon: Zap, label: 'Workflows', path: '/workflows' },
    { icon: BarChart3, label: 'Insights', path: '/insights' },
];

const bottomNavItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/event-types' && location.pathname === '/') return true;
        return location.pathname.startsWith(path);
    };



    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed left-0 top-0 h-screen w-[230px] flex flex-col border-r border-border z-50 transition-transform lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
                style={{ background: 'hsl(0 0% 5%)' }}
            >
                {/* User Profile */}
                <div className="flex items-center gap-2 p-3 mb-2">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9px] font-bold">
                            B
                        </div>
                        <span className="text-[13px] font-semibold text-foreground">bio</span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5" />
                    </Link>
                    <button
                        className="p-1.5 rounded hover:bg-secondary ml-auto transition-colors"
                        onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
                    >
                        <Search className="w-3.5 h-3.5 text-muted-foreground" />
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
                            <Link
                                key={item.path}
                                to={item.path}
                                className="sidebar-item"
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}
