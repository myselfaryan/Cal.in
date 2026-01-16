import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    CalendarDays,
    ChevronDown,
    ChevronRight,
    ArrowRight,
    Menu,
    X,
    Check,
    Clock,
    Globe,
    Users,
    Repeat,
    ArrowUpRight,
    Smartphone,
    Laptop,
    Monitor,
    Link2,
    Shield,
    Puzzle,
    Zap,
    MapPin,
    Star,
} from 'lucide-react';
import TestimonialsSection from '@/components/ui/testimonial-v2';

export function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    const handleCTA = () => {
        navigate('/event-types');
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans overflow-x-hidden">
            {/* Header / Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:gap-10">
                        {/* Logo */}
                        <div onClick={handleCTA} className="flex items-center group cursor-pointer">
                            <span className="text-xl font-black lowercase tracking-tighter group-hover:opacity-60 transition-opacity">Cal.ai</span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-6">
                            <NavItem label="Solutions" onClick={handleCTA} hasDropdown />
                            <NavItem label="Enterprise" onClick={handleCTA} />
                            <NavItem label="Cal.ai" onClick={handleCTA} />
                            <NavItem label="Developer" onClick={handleCTA} hasDropdown />
                            <NavItem label="Resources" onClick={handleCTA} hasDropdown />
                            <NavItem label="Pricing" onClick={handleCTA} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={handleCTA} className="hidden sm:block text-[13px] font-semibold hover:opacity-70 transition-opacity">
                            Sign in
                        </button>
                        <Button onClick={handleCTA} className="bg-black text-white hover:bg-black/90 rounded-full h-10 px-4 sm:px-5 text-[12px] sm:text-[13px] font-bold gap-1 group">
                            Get started
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 shadow-2xl z-[101]">
                        <MobileNavItem label="Solutions" onClick={handleCTA} />
                        <MobileNavItem label="Enterprise" onClick={handleCTA} />
                        <MobileNavItem label="Cal.ai" onClick={handleCTA} />
                        <MobileNavItem label="Developer" onClick={handleCTA} />
                        <MobileNavItem label="Pricing" onClick={handleCTA} />
                        <hr className="border-gray-100 my-2" />
                        <button onClick={handleCTA} className="text-lg font-black text-left py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                            Sign in
                            <ArrowRight className="w-5 h-5 opacity-30" />
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-28 sm:pt-40 lg:pt-52 pb-16 sm:pb-32 px-4 sm:px-6 overflow-hidden relative">
                {/* Modern Grid Background */}
                <div className="absolute inset-0 -z-10" style={{
                    backgroundImage: `linear-gradient(to right, #f1f1f1 1px, transparent 1px), linear-gradient(to bottom, #f1f1f1 1px, transparent 1px)`,
                    backgroundSize: '4rem 4rem',
                    maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)'
                }} />

                <div className="max-w-[1440px] mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-[1.2fr,1fr] xl:grid-cols-[1.2fr,1fr] gap-12 sm:gap-20 items-start lg:items-center">
                        <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {/* New Version Badge */}
                            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full text-[11px] font-bold text-gray-400 group cursor-pointer hover:bg-gray-100 transition-colors mx-auto lg:mx-0 w-fit">
                                Cal.ai launches v1.0
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>

                            <h1 className="text-[44px] sm:text-[64px] lg:text-[72px] xl:text-[84px] font-[950] leading-[1] tracking-[-0.05em] text-center lg:text-left text-balance">
                                The better way <br className="hidden sm:block" />
                                to <span className="text-gray-300">schedule</span> <br className="hidden sm:block" />
                                your meetings
                            </h1>
                            <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 font-medium leading-[1.4] max-w-xl mx-auto lg:mx-0 text-center lg:text-left text-balance">
                                A fully customizable scheduling software for individuals, businesses taking calls and developers building scheduling platforms where users meet users.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 sm:pt-0">
                                <Button onClick={handleCTA} className="bg-black text-white hover:bg-black/90 h-[60px] px-8 rounded-full text-lg font-bold flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all transform hover:-translate-y-1 active:scale-95 w-full sm:w-auto">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign up with Google
                                </Button>
                                <Button onClick={handleCTA} variant="secondary" className="bg-gray-100/60 backdrop-blur-sm text-black hover:bg-gray-200 h-[60px] px-8 rounded-full text-lg font-bold flex items-center justify-center gap-1 group transition-all transform hover:-translate-y-1 active:scale-95 w-full sm:w-auto">
                                    Sign up with email
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                                </Button>
                            </div>
                            <p className="text-gray-400 text-sm font-bold text-center lg:text-left">No credit card required</p>

                            {/* Trust Badges */}
                            <div className="pt-10 flex flex-wrap justify-center lg:justify-start gap-10 grayscale opacity-40">
                                <div className="flex flex-col items-center lg:items-start gap-1.5">
                                    <div className="flex text-green-500 gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Trustpilot</span>
                                </div>
                                <div className="flex flex-col items-center lg:items-start gap-1.5">
                                    <div className="flex text-orange-500 gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6154]">Product Hunt</span>
                                </div>
                                <div className="flex flex-col items-center lg:items-start gap-1.5">
                                    <div className="flex text-red-500 gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600">G2 Rating</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Interactive UI Card - Locked to the right on desktop */}
                        <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-300 w-full lg:max-w-none">
                            <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[480px]">
                                {/* Left Side: Event Details */}
                                <div className="p-8 md:p-10 md:w-[42%] border-b md:border-b-0 md:border-r border-gray-100 space-y-8 bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella" alt="Isabella Valce" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-gray-400 text-xs font-bold truncate">Isabella Valce</p>
                                            <h3 className="text-xl sm:text-2xl font-black tracking-tight truncate">Photoshoot</h3>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                        Capture your special moments with our professional photography services today.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {['15m', '30m', '45m', '1h'].map(time => (
                                                <button key={time} className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all ${time === '1h' ? 'bg-gray-100 text-black border-2 border-transparent' : 'bg-transparent text-gray-400 border border-gray-100 hover:bg-gray-50'}`}>
                                                    {time}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-2.5">
                                            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
                                                <MapPin className="w-4 h-4 shrink-0" />
                                                Rock Wall Woods
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs group cursor-pointer hover:text-black">
                                                <Globe className="w-4 h-4 shrink-0" />
                                                South America/Rio de Janeiro
                                                <ChevronDown className="w-3 h-3 opacity-40" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Calendar */}
                                <div className="p-8 md:p-10 flex-1 bg-white">
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="font-bold text-base">May <span className="text-gray-400 ml-1">2025</span></h4>
                                        <div className="flex gap-4">
                                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeftIcon className="w-5 h-5 text-gray-400" /></button>
                                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRightIcon className="w-5 h-5 text-gray-400" /></button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-y-4 text-center">
                                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                                            <span key={d} className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{d}</span>
                                        ))}

                                        {/* Blank spaces for the first few days */}
                                        {Array.from({ length: 4 }).map((_, i) => <div key={`blank-${i}`} />)}

                                        {/* Dates */}
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                                            const isSelected = d === 7;
                                            const isAvailable = [1, 6, 7, 8, 9, 16, 21, 22, 27, 28, 29].includes(d);

                                            return (
                                                <button
                                                    key={d}
                                                    className={`relative aspect-square flex items-center justify-center text-xs font-bold rounded-full transition-all group overflow-visible
                                                        ${isSelected ? 'bg-[#2D3748] text-white shadow-lg' : isAvailable ? 'text-gray-900 bg-gray-50/50 hover:bg-gray-100' : 'text-gray-200 cursor-default'}
                                                    `}
                                                >
                                                    {d}
                                                    {d === 1 && <div className="absolute bottom-1 w-1 h-1 bg-black rounded-full" />}
                                                    {d === 9 && <div className="absolute bottom-1 w-1 h-1 bg-black rounded-full" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Floating Element */}
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-gray-100/50 rounded-full blur-[100px] -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Logo Infinite Marquee */}
            <section className="py-16 sm:py-28 border-y border-gray-100 bg-gray-50/20 overflow-hidden">
                <div className="max-w-[1400px] mx-auto">
                    <p className="text-center text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-12 sm:mb-20 px-8">
                        Trusted by industry-defining teams
                    </p>
                    <div className="relative flex overflow-hidden group">
                        <div className="flex animate-marquee whitespace-nowrap gap-16 sm:gap-32 py-8 grayscale opacity-25 group-hover:opacity-100 transition-opacity duration-700 items-center">
                            <Logo name="Lattice" />
                            <Logo name="Storyblok" />
                            <Logo name="Framer" />
                            <Logo name="Ramp" />
                            <Logo name="Coinbase" />
                            <Logo name="Mercury" />
                            <Logo name="PlanetScale" />
                            <Logo name="Vercel" />
                            <Logo name="Linear" />
                        </div>
                        <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap gap-16 sm:gap-32 py-8 grayscale opacity-25 group-hover:opacity-100 transition-opacity duration-700 items-center" aria-hidden="true">
                            <Logo name="Lattice" />
                            <Logo name="Storyblok" />
                            <Logo name="Framer" />
                            <Logo name="Ramp" />
                            <Logo name="Coinbase" />
                            <Logo name="Mercury" />
                            <Logo name="PlanetScale" />
                            <Logo name="Vercel" />
                            <Logo name="Linear" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Step Onboarding Section */}
            <section className="py-24 sm:py-48 px-4 sm:px-6 max-w-[1400px] mx-auto overflow-hidden">
                <div className="text-center mb-20 sm:mb-40 space-y-6 sm:space-y-8">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-[0.4em] text-gray-300">The Infrastructure</span>
                    <h2 className="text-[36px] sm:text-[52px] lg:text-[72px] font-[950] tracking-tight leading-[1] sm:leading-[0.95] mb-6 px-4 text-balance">
                        Appointment scheduling <br className="hidden sm:block" /> made <span className="text-gray-300">unbelievably</span> easy
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-16 sm:gap-20 lg:gap-32 px-4 sm:px-0">
                    <StepCard
                        number="1"
                        title="Connect your calendar"
                        description="We'll handle all the cross-referencing, so you don't have to worry about double-booking."
                        icon={CalendarDays}
                        onClick={handleCTA}
                    />
                    <StepCard
                        number="2"
                        title="Set your availability"
                        description="Want to block off weekends? Set up any buffers? We make that easy."
                        icon={Clock}
                        onClick={handleCTA}
                    />
                    <StepCard
                        number="3"
                        title="Choose how to meet"
                        description="A casual video chat, phone call, or meet at a physical location!"
                        icon={Users}
                        onClick={handleCTA}
                    />
                </div>
            </section>

            {/* All-Purpose Feature Grid */}
            <section className="py-24 sm:py-48 px-4 sm:px-6 bg-gray-50/40 overflow-hidden">
                <div className="max-w-[1400px] mx-auto space-y-28 sm:space-y-48">
                    <div className="text-center space-y-6 sm:space-y-8">
                        <h2 className="text-[36px] sm:text-[52px] lg:text-[72px] font-[950] tracking-tight leading-none mb-6 text-balance">
                            An all-purpose <br className="sm:hidden" /> scheduling app
                        </h2>
                        <p className="text-xl sm:text-2xl text-gray-500 font-medium max-w-3xl mx-auto px-6 text-balance">Discover a variety of our advanced features. Unlimited and free for individuals.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 sm:gap-16">
                        {/* Feature 1 */}
                        <div onClick={handleCTA} className="bg-white p-10 sm:p-20 rounded-[40px] sm:rounded-[64px] border border-gray-100 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_48px_120px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer active:scale-[0.99]">
                            <div className="space-y-6 sm:space-y-8 max-w-md mb-16 sm:mb-24">
                                <div className="w-14 h-14 sm:w-16 h-16 rounded-[24px] bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <Clock className="w-7 h-7 sm:w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-3xl sm:text-5xl font-black tracking-tighter">Avoid meeting overload</h3>
                                <p className="text-gray-500 font-bold leading-relaxed text-lg sm:text-2xl text-balance">
                                    Only get booked when you want to. Set daily, weekly or monthly meeting limits and add buffers around your events.
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 space-y-8 sm:space-y-10 border border-gray-100 shadow-inner">
                                <div className="flex items-center justify-between border-b border-gray-200/60 pb-6">
                                    <span className="font-black text-[11px] sm:text-xs uppercase tracking-[0.3em] text-gray-300">Dashboard / Settings</span>
                                    <div className="flex gap-2.5 opacity-20">
                                        {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-black" />)}
                                    </div>
                                </div>
                                <div className="space-y-6 sm:space-y-8">
                                    <SettingRow label="Minimum notice" value="24 hours" />
                                    <SettingRow label="Buffer before" value="15 min" />
                                    <SettingRow label="Buffer after" value="10 min" />
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div onClick={handleCTA} className="bg-white p-10 sm:p-20 rounded-[40px] sm:rounded-[64px] border border-gray-100 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_48px_120px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer active:scale-[0.99]">
                            <div className="space-y-6 sm:space-y-8 max-w-md mb-16 sm:mb-24">
                                <div className="w-14 h-14 sm:w-16 h-16 rounded-[24px] bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <Link2 className="w-7 h-7 sm:w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-3xl sm:text-5xl font-black tracking-tighter">Custom booking links</h3>
                                <p className="text-gray-500 font-bold leading-relaxed text-lg sm:text-2xl text-balance">
                                    Customize your booking link so it's short and easy to remember. No more long, complicated links.
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[300px] relative border border-gray-100 shadow-inner overflow-hidden">
                                <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-gray-200 p-6 sm:p-10 flex items-center gap-4 sm:gap-6 shadow-2xl hover:scale-105 transition-transform cursor-pointer relative z-10 w-full sm:w-auto overflow-hidden">
                                    <span className="text-gray-400 font-black text-lg sm:text-3xl whitespace-nowrap select-none">cal.ai/</span>
                                    <span className="text-black font-black text-lg sm:text-3xl truncate">johndoe</span>
                                    <div className="w-6 h-6 sm:w-10 h-10 bg-green-500 rounded-full flex items-center justify-center ml-2 sm:ml-4 shrink-0 shadow-lg shadow-green-500/20">
                                        <Check className="w-3.5 sm:w-6 h-3.5 sm:h-6 text-white" />
                                    </div>
                                </div>
                                {/* Decorative Floating Labels */}
                                <div className="absolute top-10 sm:top-14 left-10 sm:left-14 py-2 px-4 bg-white border border-gray-100 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40 shadow-sm animate-bounce">15 min</div>
                                <div className="absolute bottom-10 sm:bottom-14 right-10 sm:right-14 py-2 px-4 bg-white border border-gray-100 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40 shadow-sm animate-bounce delay-150">1 hour</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expanded Grid Features Section */}
            <section className="py-24 sm:py-48 px-4 sm:px-6 max-w-[1400px] mx-auto overflow-hidden">
                <div className="text-center mb-20 sm:mb-32 px-4">
                    <h2 className="text-[36px] sm:text-[52px] lg:text-[72px] font-[950] tracking-tight mb-4 sm:mb-8 text-balance">
                        And so <span className="text-gray-300">much</span> more!
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 max-w-6xl mx-auto">
                    <SmallFeature icon={Repeat} title="Recurring" onClick={handleCTA} />
                    <SmallFeature icon={Users} title="Collective" onClick={handleCTA} />
                    <SmallFeature icon={Shield} title="Privacy" onClick={handleCTA} />
                    <SmallFeature icon={Globe} title="65+ Lungs" onClick={handleCTA} />
                    <SmallFeature icon={Puzzle} title="Apps" onClick={handleCTA} />
                    <SmallFeature icon={Smartphone} title="Android" onClick={handleCTA} />
                    <SmallFeature icon={Laptop} title="MacOS" onClick={handleCTA} />
                    <SmallFeature icon={Monitor} title="Windows" onClick={handleCTA} />
                    <SmallFeature icon={Zap} title="Workflows" onClick={handleCTA} />
                    <SmallFeature icon={Check} title="Compliance" onClick={handleCTA} />
                </div>
            </section>

            {/* AI - Cal.ai Section (Ultra Premium Dark) */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
                <div className="max-w-[1400px] mx-auto bg-[#050505] rounded-[48px] sm:rounded-[80px] p-10 sm:p-28 lg:p-40 text-white overflow-hidden relative shadow-[0_80px_160px_-40px_rgba(0,0,0,0.6)] border border-white/5">
                    <div className="relative z-10 grid lg:grid-cols-[1.2fr,1fr] gap-16 sm:gap-24 items-center">
                        <div className="space-y-10 sm:space-y-16">
                            <div className="space-y-6 sm:space-y-10">
                                <div onClick={handleCTA} className="inline-flex items-center gap-4 bg-blue-500/10 text-blue-400 px-6 sm:px-8 py-3 rounded-full text-[11px] sm:text-sm font-black uppercase tracking-[0.3em] border border-blue-500/20 cursor-pointer hover:bg-blue-500/20 transition-all shadow-lg active:scale-95 group">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse group-hover:scale-125 transition-transform" />
                                    Cal.ai is here
                                </div>
                                <h2 className="text-[48px] sm:text-[72px] lg:text-[100px] font-black tracking-[-0.06em] leading-[0.95] mt-8 text-balance">
                                    Scheduling <br className="hidden sm:block" /> powered <br className="hidden sm:block" /> by AI
                                </h2>
                            </div>
                            <p className="text-xl sm:text-3xl text-gray-500 font-medium leading-[1.5] max-w-xl text-balance">
                                Turn scheduling into a conversation. Our lifelike AI agents book, reschedule, and handle follow-ups automatically.
                            </p>
                            <div className="flex flex-wrap gap-5 sm:gap-8">
                                <Button onClick={handleCTA} className="bg-white text-black hover:bg-gray-100 rounded-full h-[60px] sm:h-[72px] px-10 sm:px-14 text-lg sm:text-xl font-black transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto shadow-xl">Try Cal.ai</Button>
                                <Button onClick={handleCTA} variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full h-[60px] sm:h-[72px] px-10 sm:px-14 text-lg sm:text-xl font-black group w-full sm:w-auto border border-white/10">
                                    Learn more
                                    <ArrowUpRight className="ml-3 w-6 h-6 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform" />
                                </Button>
                            </div>
                        </div>
                        <div className="relative group perspective-1000 cursor-pointer w-full max-w-[700px] mx-auto lg:mx-0" onClick={handleCTA}>
                            <div className="aspect-video bg-gradient-to-br from-white/10 to-transparent rounded-[32px] sm:rounded-[48px] border border-white/10 flex items-center justify-center overflow-hidden transform group-hover:rotate-1 group-hover:scale-[1.03] transition-all duration-700 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent)]" />
                                <div className="w-20 h-20 sm:w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform">
                                    <div className="w-0 h-0 border-l-[16px] sm:border-l-[24px] border-l-black border-y-[10px] sm:border-y-[16px] border-y-transparent ml-2 sm:ml-3" />
                                </div>
                                {/* Video Mock Overlay */}
                                <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12 flex items-center justify-between opacity-50">
                                    <div className="flex gap-1.5 shrink-0">
                                        {[1, 2, 3, 4].map(i => <div key={i} className={`h-3 sm:h-6 w-1 sm:w-1.5 bg-white rounded-full animate-bubble opacity-${i * 20}`} />)}
                                    </div>
                                    <div className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Lifelike Demo</div>
                                </div>
                            </div>
                            {/* Blue Pulse Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-blue-500/15 blur-[120px] sm:blur-[200px] -z-10 animate-pulse duration-[4s]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Ready to join? CTA Section */}
            <section className="py-28 sm:py-52 px-4 sm:px-6 text-center overflow-hidden relative">
                <div className="max-w-5xl mx-auto space-y-10 sm:space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 relative z-10">
                    <h2 className="text-[44px] sm:text-[64px] lg:text-[88px] font-black tracking-tighter leading-[1.1] sm:leading-[1] px-4 text-balance">
                        Ready to Join the <br className="hidden sm:block" /> Future of Scheduling?
                    </h2>
                    <p className="text-xl sm:text-3xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed px-6 text-balance">
                        Join 200,000+ individuals and companies building the automated world of tomorrow.
                    </p>
                    <div className="flex justify-center gap-5 pt-8 px-6">
                        <Button onClick={handleCTA} className="bg-black text-white hover:bg-black/90 h-[64px] sm:h-[80px] px-12 sm:px-20 rounded-full text-xl sm:text-2xl font-black shadow-[0_24px_48px_-8px_rgba(0,0,0,0.2)] transition-all transform hover:-translate-y-1.5 active:scale-95 w-full sm:w-auto">
                            Get started for free
                        </Button>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-gray-400">No credit card required. Free forever for individuals.</p>
                </div>
            </section>

            {/* Global Footer */}
            <footer className="pt-28 sm:pt-48 pb-20 sm:pb-32 px-4 sm:px-6 border-t border-gray-100 overflow-hidden bg-gray-50/10">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-16 sm:gap-24 mb-32 sm:mb-48 px-4 lg:px-0">
                        <div className="col-span-1 sm:col-span-2 space-y-10 sm:space-y-12 text-center sm:text-left">
                            <div onClick={handleCTA} className="text-3xl font-black lowercase tracking-tighter block hover:opacity-60 transition-opacity cursor-pointer">Cal.ai</div>
                            <p className="text-gray-400 font-bold text-lg sm:text-xl leading-relaxed max-w-sm mx-auto sm:mx-0 text-balance">The better way to schedule meetings for individuals, businesses, and developers.</p>
                            <div className="flex justify-center sm:justify-start gap-8 grayscale opacity-30 h-6">
                                <TwitterIcon />
                                <GithubIcon />
                                <LinkedInIcon />
                            </div>
                        </div>
                        <FooterCol title="Product" links={['Solutions', 'Enterprise', 'Cal.ai', 'Developer', 'Pricing']} onClick={handleCTA} />
                        <FooterCol title="Industry" links={['Sales', 'Marketing', 'Customer Loyalty', 'Education']} onClick={handleCTA} />
                        <FooterCol title="Resources" links={['Help Docs', 'Blog', 'Status', 'Developers']} onClick={handleCTA} />
                        <FooterCol title="Company" links={['About', 'Privacy', 'Terms', 'Contact']} onClick={handleCTA} />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 sm:gap-16 pt-16 sm:pt-20 border-t border-gray-100 text-center md:text-left shadow-[0_-1px_0_0_rgba(0,0,0,0.05)]">
                        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 grayscale opacity-25 h-auto">
                            <ComplianceLogo name="ISO 27001" />
                            <ComplianceLogo name="SOC2 Type II" />
                            <ComplianceLogo name="GDPR" />
                            <ComplianceLogo name="HIPAA" />
                        </div>
                        <div className="space-y-3">
                            <p className="text-[13px] sm:text-[14px] font-bold text-gray-400 flex flex-wrap justify-center md:justify-end items-center gap-3">
                                <span>© 2024 Cal.ai, Inc.</span>
                                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-gray-200" />
                                <span className="whitespace-nowrap">Built with love for users</span>
                            </p>
                            <div className="flex justify-center md:justify-end gap-1.5">
                                {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-gray-100 rounded-full" />)}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Sub-components
function NavItem({ label, onClick, hasDropdown = false }: { label: string; onClick: () => void; hasDropdown?: boolean }) {
    return (
        <button onClick={onClick} className="flex items-center gap-2 text-[14px] font-bold text-black/50 hover:text-black transition-all hover:bg-gray-100 px-4 py-2 rounded-full outline-none group whitespace-nowrap active:scale-95">
            {label}
            {hasDropdown && <ChevronDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" />}
        </button>
    );
}

function MobileNavItem({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button onClick={onClick} className="flex items-center justify-between text-2xl font-[950] tracking-tight py-4 px-4 text-left w-full hover:bg-gray-50 rounded-2xl transition-all active:scale-[0.98]">
            {label}
            <ChevronRight className="w-6 h-6 opacity-20" />
        </button>
    );
}

function Logo({ name }: { name: string }) {
    return <span className="text-2xl sm:text-4xl font-black lowercase tracking-tighter shrink-0 select-none group-hover:scale-110 transition-transform duration-500">{name}</span>;
}

function StepCard({ number, title, description, icon: Icon, onClick }: { number: string; title: string; description: string; icon: any; onClick: () => void }) {
    return (
        <div onClick={onClick} className="space-y-8 sm:space-y-12 group cursor-pointer text-center sm:text-left py-4">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                <span className="text-[80px] sm:text-[110px] font-[1000] text-gray-50/50 leading-[0.8] select-none transition-all group-hover:text-gray-100 group-hover:scale-105 duration-700">{number}</span>
                <div className="w-16 h-16 sm:w-20 h-20 rounded-[24px] sm:rounded-[32px] bg-white flex items-center justify-center shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] border border-gray-100 group-hover:bg-black group-hover:border-black group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 active:scale-90">
                    <Icon className="w-8 h-8 sm:w-10 h-10 text-black group-hover:text-white transition-colors" />
                </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
                <h3 className="text-3xl sm:text-4xl font-[950] tracking-tight text-balance">{title}</h3>
                <p className="text-gray-400 font-bold text-lg sm:text-xl leading-[1.6] px-6 sm:px-0 text-balance group-hover:text-gray-600 transition-colors">{description}</p>
            </div>
        </div>
    );
}

function SettingRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between group cursor-default gap-12 py-1">
            <span className="text-[12px] sm:text-sm font-bold text-gray-300 group-hover:text-gray-500 transition-colors whitespace-nowrap">{label}</span>
            <span className="text-[12px] sm:text-sm font-black bg-white px-3 py-1 rounded-lg group-hover:bg-black group-hover:text-white transition-all shadow-sm whitespace-nowrap">{value}</span>
        </div>
    );
}

function SmallFeature({ icon: Icon, title, onClick }: { icon: any; title: string; onClick: () => void }) {
    return (
        <div onClick={onClick} className="bg-white/50 p-8 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-gray-100/80 flex flex-col items-center gap-6 text-center hover:bg-white hover:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] hover:border-transparent transition-all group active:scale-95 duration-700 cursor-pointer">
            <div className="w-14 h-14 sm:w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-110 group-hover:bg-black transition-all duration-500 shadow-sm">
                <Icon className="w-7 h-7 sm:w-8 h-8 text-black group-hover:text-white transition-colors" />
            </div>
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-black transition-colors">{title}</span>
        </div>
    );
}

function FooterCol({ title, links, onClick }: { title: string; links: string[]; onClick: () => void }) {
    return (
        <div className="space-y-8 text-center sm:text-left">
            <h4 className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.4em] text-gray-300">{title}</h4>
            <ul className="space-y-5 sm:space-y-6">
                {links.map((link) => (
                    <li key={link}>
                        <button onClick={onClick} className="font-bold text-[15px] sm:text-[16px] text-gray-400 hover:text-black hover:translate-x-1 transition-all w-full sm:w-auto px-4 py-2 sm:px-0 sm:py-0 text-center sm:text-left">{link}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ComplianceLogo({ name }: { name: string }) {
    return <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.25em] text-gray-300 hover:text-black transition-colors cursor-default">{name}</span>;
}

function ChevronLeftIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
        </svg>
    )
}

function ChevronRightIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}

function TwitterIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="hover:text-[#1DA1F2] transition-colors cursor-pointer"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

function GithubIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="hover:text-[#333] transition-colors cursor-pointer"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>;
}

function LinkedInIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="hover:text-[#0077b5] transition-colors cursor-pointer"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
}
