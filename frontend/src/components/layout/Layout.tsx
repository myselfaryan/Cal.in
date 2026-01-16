import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { CommandMenu } from './CommandMenu';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-30 flex items-center h-14 px-4 border-b border-border bg-background/80 backdrop-blur-md">
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <Menu className="w-5 h-5 text-muted-foreground" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
                        B
                    </div>
                    <span className="text-sm font-semibold">bio</span>
                </div>
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <CommandMenu />

            <main className="lg:ml-[230px] min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}
