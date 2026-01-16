import React from 'react';
import { motion } from "framer-motion";

// --- Types ---
interface Testimonial {
    text: string;
    image: string;
    name: string;
    role: string;
}

// --- Data ---
const testimonials: Testimonial[] = [
    {
        text: "This platform revolutionized our operations. The scheduling features are intuitive and saved us hours every week.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Briana Patton",
        role: "Operations Manager",
    },
    {
        text: "Implementing Cal.ai was smooth and quick. The customizable interface made team training effortless.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Bilal Ahmed",
        role: "IT Manager",
    },
    {
        text: "The AI features are exceptional, handling follow-ups and rescheduling automatically. It feels like magic.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Saman Malik",
        role: "Customer Support Lead",
    },
    {
        text: "Seamless integration improved our efficiency. Highly recommend for the clean, professional booking pages.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Omar Raza",
        role: "CEO",
    },
    {
        text: "Its robust features and quick support have transformed our workflow. We can't imagine working without it.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Zainab Hussain",
        role: "Project Manager",
    },
    {
        text: "The smooth implementation exceeded expectations. It streamlined processes for our entire remote team.",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Aliza Khan",
        role: "Business Analyst",
    },
    {
        text: "Our client bookings doubled with the user-friendly design and professional appearance.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Farhan Siddiqui",
        role: "Marketing Director",
    },
    {
        text: "They delivered a solution that actually understands how modern teams schedule. Essential tool.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Sana Sheikh",
        role: "Sales Manager",
    },
    {
        text: "Using Cal.ai, our meeting no-show rates dropped significantly. A absolute game-changer for sales.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Hassan Ali",
        role: "E-commerce Manager",
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

// --- Sub-Components ---
const TestimonialsColumn = (props: {
    className?: string;
    testimonials: Testimonial[];
    duration?: number;
}) => {
    return (
        <div className={props.className}>
            <motion.ul
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {props.testimonials.map(({ text, image, name, role }, i) => (
                                <motion.li
                                    key={`${index}-${i}`}
                                    className="p-8 sm:p-10 rounded-[32px] border border-gray-100 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] w-full bg-white hover:bg-gray-50/50 transition-all duration-300 cursor-default select-none group"
                                >
                                    <blockquote className="m-0 p-0 space-y-6">
                                        <p className="text-gray-500 font-medium leading-relaxed m-0 text-base sm:text-lg">
                                            "{text}"
                                        </p>
                                        <footer className="flex items-center gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0.5 border border-gray-100 bg-white">
                                                <img
                                                    src={image}
                                                    alt={`Avatar of ${name}`}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <cite className="font-bold text-sm sm:text-base not-italic text-black">
                                                    {name}
                                                </cite>
                                                <span className="text-xs sm:text-sm font-semibold text-gray-400">
                                                    {role}
                                                </span>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </motion.li>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.ul>
        </div>
    );
};

export const TestimonialsSection = () => {
    return (
        <section
            aria-labelledby="testimonials-heading"
            className="bg-transparent py-24 sm:py-32 relative overflow-hidden"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="container px-4 z-10 mx-auto max-w-[1400px]"
            >
                <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-16 sm:mb-24 px-4">
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            Testimonials
                        </span>
                    </div>

                    <h2 id="testimonials-heading" className="text-[36px] sm:text-[52px] lg:text-[72px] font-[950] tracking-tight leading-[1] text-center text-black mb-6 sm:mb-8 text-balance">
                        Loved by thousands <br className="hidden sm:block" /> of <span className="text-gray-300">users</span>
                    </h2>
                    <p className="text-center text-lg sm:text-2xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
                        See how teams are transforming their scheduling workflow with Cal.ai.
                    </p>
                </div>

                <div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[700px] overflow-hidden"
                >
                    <TestimonialsColumn testimonials={firstColumn} duration={35} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={45} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={38} />
                </div>
            </motion.div>
        </section>
    );
};

export default TestimonialsSection;
