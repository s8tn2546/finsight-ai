import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Target, ArrowRight } from 'lucide-react';

export default function HowItWorksSection() {
    const steps = [
        {
            id: "01",
            title: 'Aggregate Data',
            description: 'We continuously ingest live market feeds, historical pricing, and global sentiment indicators into our unified data lake.',
            icon: Database,
            color: "from-blue-500 to-primary",
        },
        {
            id: "02",
            title: 'AI Processing',
            description: 'Neural networks and LLMs analyze the massive datasets to identify micro-trends, assess risk correlations, and model predictive outcomes.',
            icon: Cpu,
            color: "from-primary to-accent",
        },
        {
            id: "03",
            title: 'Strategic Application',
            description: 'You receive clear, actionable strategies bridging the gap between theoretical market learning and real-world capital deployment.',
            icon: Target,
            color: "from-accent to-emerald-400",
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-secondary/10 border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-semibold tracking-wide uppercase"
                    >
                        The Process
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                    >
                        Bridging Theory and Action
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-xl text-gray-400"
                    >
                        How FinSight AI transforms raw market data into your strategic advantage.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Connecting line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                {/* Step Icon Hexagon/Circle Container */}
                                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} p-[1px] mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                                    <div className="w-full h-full bg-background/90 backdrop-blur-sm rounded-2xl flex items-center justify-center relative overflow-hidden">
                                        {/* Glow effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
                                        <step.icon className="w-10 h-10 text-white relative z-10 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>

                                {/* Step Content */}
                                <div className="flex items-center justify-center space-x-2 mb-4">
                                    <span className="text-sm font-bold text-primary/60">{step.id}</span>
                                    <h4 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                        {step.title}
                                    </h4>
                                </div>

                                <p className="text-gray-400 leading-relaxed max-w-sm">
                                    {step.description}
                                </p>

                                {/* Arrow pointing down on mobile, right on desktop */}
                                {index < steps.length - 1 && (
                                    <div className="mt-8 md:hidden text-primary/30 animate-pulse">
                                        <ArrowRight className="w-6 h-6 rotate-90" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
