import React from 'react';
import { motion } from 'framer-motion';

export default function StatsSection() {
    const stats = [
        { id: 1, name: 'AI Prediction Accuracy', value: '78%' },
        { id: 2, name: 'Simulated Predictions', value: '1,200+' },
        { id: 3, name: 'Sentiment Tracking', value: 'Real-Time' },
        { id: 4, name: 'AI Integration Modules', value: '4+' },
    ];

    return (
        <section className="bg-secondary/30 border-y border-white/5 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-y-16 lg:gap-x-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center justify-center text-center pl-4 border-l border-white/10 first:border-l-0"
                        >
                            <dd className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-2">
                                {stat.value}
                            </dd>
                            <dt className="text-base font-medium text-primary">
                                {stat.name}
                            </dt>
                        </motion.div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
