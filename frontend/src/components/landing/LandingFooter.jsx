import React from 'react';
import { Activity, Twitter, Linkedin, Github } from 'lucide-react';

export default function LandingFooter() {
    return (
        <footer className="bg-[#0a0f18] text-gray-400 py-12 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-2">
                                <Activity className="text-white w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                FinSight <span className="text-primary">AI</span>
                            </span>
                        </div>
                        <p className="text-sm mb-4">
                            Empowering your financial intuition with next-generation AI analytics and strategic guidance.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} FinSight AI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
