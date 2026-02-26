import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CtaSection() {
    const navigate = useNavigate();

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-background" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[100px] animate-pulse" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-secondary/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden"
                >
                    {/* Subtle grid pattern overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGg2ME0wIDBsNjAgNjAiIGZpbGw9Im5vbmUiLz48L2c+PC9zdmc+')] opacity-50 mix-blend-overlay" />

                    <div className="relative z-10">
                        <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                            Ready to Navigate the Market <br className="hidden md:block" />
                            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Machine Precision?</span>
                        </h2>

                        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                            Join thousands of forward-thinking investors and analysts leveraging the unified FinSight AI ecosystem today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-secondary font-bold rounded-lg hover:bg-white transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,196,211,0.5)] flex items-center justify-center group"
                            >
                                Access Platform
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-sm text-gray-500 mt-4 sm:mt-0 sm:ml-4">
                                No credit card required. Free 14-day trial.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
