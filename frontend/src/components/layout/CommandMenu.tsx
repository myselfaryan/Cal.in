import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
    Calendar,
    Clock,
    Link2,
    LayoutGrid,
    ArrowUp,
    ArrowDown,
    CornerDownLeft,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command"

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)

        // Listen for custom trigger event
        const handleOpenSearch = () => setOpen(true)
        window.addEventListener('open-search', handleOpenSearch)

        return () => {
            document.removeEventListener("keydown", down)
            window.removeEventListener('open-search', handleOpenSearch)
        }
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="EVENT TYPES">
                    <CommandItem onSelect={() => runCommand(() => navigate("/event-types"))}>
                        <Link2 className="mr-2 h-4 w-4" />
                        <span>Event types</span>
                        <CommandShortcut>e t</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/book/30min"))}>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>30 min meeting</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/book/15min"))}>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>15 min meeting</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/book/secret"))}>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Secret meeting</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="APPS">
                    <CommandItem onSelect={() => runCommand(() => navigate("/apps"))}>
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>App Store</span>
                        <CommandShortcut>a s</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="BOOKINGS">
                    <CommandItem onSelect={() => runCommand(() => navigate("/bookings"))}>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Upcoming</span>
                        <CommandShortcut>u b</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>

            {/* Custom Footer like in the mockup */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-secondary/30 text-[10px] text-muted-foreground uppercase font-semibold">
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                        <ArrowUp className="w-3 h-3" />
                        <ArrowDown className="w-3 h-3" />
                    </div>
                    <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CornerDownLeft className="w-3 h-3" />
                    <span>Open</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                        <span className="text-[12px]">⌘</span>
                        <span>K</span>
                    </div>
                    <span>Close</span>
                </div>
            </div>
        </CommandDialog>
    )
}
