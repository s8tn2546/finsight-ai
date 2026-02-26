import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex items-center">
            {/* Background gradients */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] -z-10 mix-blend-screen" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 bg-secondary/80 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm"
                    >
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-300">Unified Financial Intelligence Ecosystem</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-[4rem] font-extrabold tracking-tight text-white mb-8 leading-[1.1]"
                    >
                        Master the Markets with <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-purple-400 animate-gradient-x p-1">
                            AI-Powered Strategic Guidance
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-loose"
                    >
                        Bridge learning and real market application. FinSight AI provides real-time analytics, predictive insights, and expert advisory logic to help you navigate financial complexities with confidence.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                    >
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-secondary font-bold rounded-lg hover:bg-white transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,211,242,0.4)] flex items-center justify-center group"
                        >
                            Explore Dashboard
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            href="#features"
                            className="w-full sm:w-auto px-8 py-4 bg-secondary border border-white/10 text-white font-semibold rounded-lg hover:bg-white/5 transition-all flex items-center justify-center"
                        >
                            Explore Features
                        </button>
                    </motion.div>

                    {/* Trust/Minimal UI Element */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center justify-center"
                    >
                        <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider font-semibold">Trusted interface elements</p>
                        <div className="flex gap-4 md:gap-12 opacity-50 grayscale">
                            <div className="flex items-center text-lg font-bold text-gray-400">
                                <TrendingUp className="w-5 h-5 mr-2" /> Live Data
                            </div>
                            <div className="flex items-center text-lg font-bold text-gray-400">
                                <Activity className="w-5 h-5 mr-2" /> Real-time
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
