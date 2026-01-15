import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Clock,
    Users,
    Video,
    Shield,
    Zap,
    Globe,
    Puzzle,
    Star,
    ChevronRight,
    Play,
    Check,
    ArrowRight,
    Menu,
    X,
    CalendarDays,
    CalendarCheck,
    Timer,
    Bell,
    Link2,
    Settings,
    BarChart3,
} from 'lucide-react';

export function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                                <CalendarDays className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Cal.in</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Solutions
                            </a>
                            <a href="#enterprise" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Enterprise
                            </a>
                            <a href="#integrations" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Integrations
                            </a>
                            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Pricing
                            </a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/event-types">
                                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                    Sign in
                                </Button>
                            </Link>
                            <Link to="/event-types">
                                <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6">
                                    Get started
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
                        <div className="flex flex-col gap-4">
                            <a href="#features" className="text-gray-600 hover:text-gray-900">Solutions</a>
                            <a href="#enterprise" className="text-gray-600 hover:text-gray-900">Enterprise</a>
                            <a href="#integrations" className="text-gray-600 hover:text-gray-900">Integrations</a>
                            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
                            <hr className="border-gray-200" />
                            <Link to="/event-types" className="text-gray-900 font-medium">Sign in</Link>
                            <Link to="/event-types">
                                <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-full">
                                    Get started
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Text Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span>Trusted by 100,000+ users</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                                The better way to{' '}
                                <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    schedule your
                                </span>{' '}
                                meetings
                            </h1>

                            <p className="text-lg text-gray-600 max-w-xl">
                                A fully customizable scheduling software for individuals,
                                businesses, teams and developers. Built to help you manage
                                your time smarter.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/event-types">
                                    <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base flex items-center gap-2 group">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988h-2.54v-2.891h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fill="currentColor" />
                                        </svg>
                                        Sign up with Google
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link to="/event-types">
                                    <Button variant="outline" className="rounded-full px-8 py-6 text-base border-gray-300 hover:bg-gray-50">
                                        Sign up with email
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>

                            <p className="text-sm text-gray-500">No credit card required</p>
                        </div>

                        {/* Right: Interactive Demo Card */}
                        <div className="relative">
                            {/* Main Calendar Card */}
                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                                {/* Event Type Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                            JD
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">John Doe</p>
                                            <h3 className="font-semibold text-gray-900">Photoshoot</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" /> 60 min
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Video className="w-4 h-4" /> Google Meet
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Calendar Grid */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold">May 2026</h4>
                                        <div className="flex gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <ChevronRight className="w-5 h-5 rotate-180" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 text-center text-sm">
                                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                                            <div key={day} className="py-2 text-gray-400 font-medium">
                                                {day}
                                            </div>
                                        ))}
                                        {[...Array(35)].map((_, i) => {
                                            const day = i - 4;
                                            const isCurrentMonth = day >= 1 && day <= 31;
                                            const isSelected = day === 8;
                                            const hasSlots = [6, 7, 8, 13, 14, 15, 20, 21, 22, 27, 28].includes(day);

                                            return (
                                                <div
                                                    key={i}
                                                    className={`py-2 text-sm cursor-pointer rounded-md transition-all ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'} ${isSelected ? 'bg-gray-900 text-white' : hasSlots ? 'hover:bg-gray-100' : ''} ${hasSlots && !isSelected ? 'font-medium' : ''}`}
                                                >
                                                    {isCurrentMonth ? day : ''}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Review Cards */}
                            <div className="absolute -bottom-4 -left-8 bg-white rounded-xl shadow-lg p-4 border border-gray-100 max-w-[200px]" style={{ animation: 'bounce-slow 3s ease-in-out infinite' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-yellow-400">
                                        {'★★★★★'.split('').map((star, i) => (
                                            <span key={i} className="text-sm">{star}</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600">Seamless booking experience!</p>
                            </div>

                            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100 animate-pulse">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-sm font-medium">Booking confirmed!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-12 border-y border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500 mb-8">
                        Trusted by fast-moving companies around the world
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 grayscale">
                        {['Ramp', 'PlanetScale', 'Mercury', 'Coinbase', 'Storyblock'].map((company) => (
                            <div key={company} className="text-xl font-bold text-gray-400">
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500">
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                        What is Cal.in
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        With us, appointment scheduling{' '}
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            is easy
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
                        Effortless scheduling for business and individuals, powerful
                        solutions for fast-growing organizations.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/event-types">
                            <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base">
                                Get started
                            </Button>
                        </Link>
                        <Button variant="outline" className="rounded-full px-8 py-6 text-base border-gray-300">
                            Talk to sales
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: CalendarDays,
                                title: 'Connect your calendar',
                                description: "We'll handle all the cross-referencing, so you don't have to worry about double-booking.",
                                color: 'from-blue-500 to-cyan-500',
                            },
                            {
                                icon: Settings,
                                title: 'Set your availability',
                                description: 'Want to block off weekends? Set up any buffers? We make that easy.',
                                color: 'from-purple-500 to-pink-500',
                            },
                            {
                                icon: Users,
                                title: 'Choose how to meet',
                                description: 'A casual be a video chat, phone call, or a walk in the park!',
                                color: 'from-orange-500 to-red-500',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* All-Purpose Scheduling App */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            Your all-purpose{' '}
                            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                scheduling app
                            </span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover a variety of our advanced features. Unlimited and free for individuals.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Feature Card 1 */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <Bell className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Avoid meeting overload</h3>
                                    <p className="text-gray-600 text-sm">
                                        Only get booked when you want to. Set daily, weekly or monthly
                                        meeting limits and add buffers around your events to allow
                                        you to focus or take a break.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Minimum notice</span>
                                        <span className="text-sm font-medium">24 hours</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Buffer before event</span>
                                        <span className="text-sm font-medium">15 min</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Buffer after event</span>
                                        <span className="text-sm font-medium">10 min</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <Link2 className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Stand out with a custom booking link</h3>
                                    <p className="text-gray-600 text-sm">
                                        Customize your booking link so it's short and easy to
                                        remember for your bookers. No more long, complicated
                                        links you can easily forget.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200">
                                    <span className="text-gray-400">cal.in/</span>
                                    <span className="text-purple-600 font-medium">john</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Timer className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Notice and buffers</h3>
                                    <p className="text-gray-600 text-sm">
                                        Set minimum notice periods and buffer times between meetings
                                        to stay organized and prepared.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature Card 4 */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <CalendarCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Streamline your bookers experience</h3>
                                    <p className="text-gray-600 text-sm">
                                        Real-time calendar updates, receive booking confirmations
                                        via text or email, get events added to their calendar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid - "...and so much more!" */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
                        ...and so much{' '}
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            more!
                        </span>
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Video, label: 'Built-in video conferencing' },
                            { icon: Clock, label: 'Short booking links' },
                            { icon: Shield, label: 'Privacy first' },
                            { icon: Globe, label: '45+ languages' },
                            { icon: Puzzle, label: 'Easy embeds' },
                            { icon: Zap, label: 'All your favorite apps' },
                            { icon: Settings, label: 'Simple customization' },
                            { icon: BarChart3, label: 'Advanced analytics' },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-900 transition-colors">
                                    <item.icon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI-Powered Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500">
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                            AI Agents
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            Supercharged scheduling with
                        </h2>
                        <h3 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-400 bg-clip-text text-transparent">
                            AI-powered calls
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto mt-6">
                            Turn scheduling into a conversation. Cal.in AI uses lifelike agents to book
                            meetings, send reminders and follow up all through natural phone calls.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        <Link to="/event-types">
                            <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base">
                                Try AI scheduling
                            </Button>
                        </Link>
                        <Button variant="outline" className="rounded-full px-8 py-6 text-base border-gray-300">
                            Learn more
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* AI Video Preview */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 md:p-16">
                        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')" }}></div>
                        <div className="relative text-center">
                            <h4 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                Introducing
                            </h4>
                            <h5 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
                                AI-powered calls
                            </h5>
                            <button className="mt-8 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto hover:bg-white/20 transition-colors border border-white/20">
                                <Play className="w-6 h-6 text-white ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            Don't just take our{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                word for it
                            </span>
                        </h2>
                        <p className="text-gray-600">
                            Our users are our best ambassadors. Discover why we're the top choice for scheduling meetings.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                quote: "I finally made the move after I couldn't find how to cancel on the Calendly dashboard!",
                                author: 'Lea Wilson',
                                role: 'CEO, TechStart',
                                avatar: 'LW',
                                color: 'from-pink-500 to-rose-500',
                            },
                            {
                                quote: "Just gave it a go and it's definitely the easiest meeting I've ever scheduled!",
                                author: 'Eric Mikael',
                                role: 'Founder, Startup.io',
                                avatar: 'EM',
                                color: 'from-blue-500 to-cyan-500',
                            },
                            {
                                quote: "Very easy to set up and start. Connected with my Google calendar without any problem.",
                                author: 'Pankaj Dixit',
                                role: 'Designer, Creative Co',
                                avatar: 'PD',
                                color: 'from-purple-500 to-violet-500',
                            },
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                            >
                                <p className="text-gray-700 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-semibold text-sm`}>
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integrations Section */}
            <section id="integrations" className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                App Store
                            </div>
                            <h2 className="text-4xl font-bold mb-6">
                                All your key tools{' '}
                                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    in-sync
                                </span>{' '}
                                with your meetings
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Cal.in works with all apps already in your flow ensuring everything
                                works perfectly together.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/event-types">
                                    <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8">
                                        Get started
                                    </Button>
                                </Link>
                                <Button variant="outline" className="rounded-full px-8 border-gray-300">
                                    Explore apps
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { name: 'Google', color: '#4285F4' },
                                { name: 'Slack', color: '#4A154B' },
                                { name: 'Zoom', color: '#2D8CFF' },
                                { name: 'Teams', color: '#6264A7' },
                                { name: 'Notion', color: '#000000' },
                                { name: 'Stripe', color: '#635BFF' },
                                { name: 'Zapier', color: '#FF4A00' },
                                { name: 'HubSpot', color: '#FF7A59' },
                            ].map((app, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex items-center justify-center aspect-square"
                                >
                                    <span className="font-bold text-xs" style={{ color: app.color }}>
                                        {app.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                        Smarter, simpler{' '}
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            scheduling
                        </span>
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of professionals who trust Cal.in for their scheduling needs.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <Link to="/event-types">
                            <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base">
                                Get started
                            </Button>
                        </Link>
                        <Button variant="outline" className="rounded-full px-8 py-6 text-base border-gray-300">
                            Talk to sales
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Rating badges */}
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        {['Product Hunt', 'G2', 'Capterra'].map((platform) => (
                            <div key={platform} className="flex items-center gap-2">
                                <div className="flex text-yellow-400 text-sm">
                                    {'★★★★★'.split('').map((star, i) => (
                                        <span key={i}>{star}</span>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">{platform}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-5 gap-8 mb-12">
                        {/* Logo & Description */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                                    <CalendarDays className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">Cal.in</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-6 max-w-xs">
                                The open source scheduling infrastructure. Made with ❤️ for everyone.
                            </p>
                            <div className="flex gap-4">
                                {['Twitter', 'GitHub', 'LinkedIn', 'Discord'].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors text-xs font-medium"
                                    >
                                        {social[0]}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        {[
                            {
                                title: 'Solutions',
                                links: ['iOS/Android App', 'Self-hosted', 'Pricing', 'Enterprise'],
                            },
                            {
                                title: 'Use Cases',
                                links: ['Sales', 'Marketing', 'Customer Support', 'Education'],
                            },
                            {
                                title: 'Resources',
                                links: ['Help Docs', 'Blog', 'Status', 'Developers'],
                            },
                        ].map((column) => (
                            <div key={column.title}>
                                <h4 className="font-semibold text-gray-900 mb-4">{column.title}</h4>
                                <ul className="space-y-3">
                                    {column.links.map((link) => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Footer */}
                    <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            © 2026 Cal.in. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Custom animations */}
            <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
        </div>
    );
}
