import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, LineChart, Newspaper, ShieldAlert } from 'lucide-react';

export default function FeaturesSection() {
    const features = [
        {
            name: 'AI Strategy Advisor',
            description: 'Get personalized, dynamic investment strategies tailored to your simulated portfolio goals and risk tolerance.',
            icon: BrainCircuit,
            className: 'md:col-span-2 md:row-span-2 bg-gradient-to-br from-secondary/50 to-background border-primary/20',
            delay: 0.1
        },
        {
            name: 'Stock Prediction Playground',
            description: 'Test hypotheses with our 78% accurate prediction models on historical and simulated market data.',
            icon: LineChart,
            className: 'md:col-span-1 md:row-span-1 bg-secondary/30 border-white/5',
            delay: 0.2
        },
        {
            name: 'Financial News Intelligence',
            description: 'Real-time sentiment tracking algorithms that synthesize market news into actionable insights.',
            icon: Newspaper,
            className: 'md:col-span-1 md:row-span-1 bg-secondary/30 border-white/5',
            delay: 0.3
        },
        {
            name: 'Portfolio Risk Analyzer',
            description: 'Deep-dive analytics into your simulated asset allocation to identify and mitigate potential vulnerabilities before they happen.',
            icon: ShieldAlert,
            className: 'md:col-span-2 md:row-span-1 bg-gradient-to-r from-secondary/40 to-accent/10 border-accent/20',
            delay: 0.4
        }
    ];

    return (
        <section id="features" className="py-24 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-base text-primary font-semibold tracking-wide uppercase"
                    >
                        Capabilities
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl"
                    >
                        A Unified Financial Ecosystem
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto"
                    >
                        Seamlessly integrated modules designed to elevate your market understanding and strategic execution.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 max-w-5xl mx-auto auto-rows-[250px]">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: feature.delay }}
                            className={`relative group rounded-2xl border p-8 hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col justify-between ${feature.className}`}
                        >
                            {/* Hover effect background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-transparent group-hover:to-accent/5 transition-all duration-500 z-0" />

                            <div className="relative z-10">
                                <div className="h-12 w-12 rounded-lg bg-background/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                                    <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{feature.name}</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
