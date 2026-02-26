import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Activity, LogIn, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../routes/AuthContext';
import AuthModal from '../common/AuthModal';

export default function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
    ];

    const openLogin = () => {
        setAuthMode('login');
        setIsAuthModalOpen(true);
    };

    const openSignup = () => {
        setAuthMode('signup');
        setIsAuthModalOpen(true);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(99,211,242,0.5)]">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            FinSight <span className="text-primary">AI</span>
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="flex items-center space-x-4 ml-4">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="flex items-center space-x-2 text-sm font-medium text-white hover:text-primary transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>{user.name || user.email || 'Dashboard'}</span>
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={openLogin}
                                        className="text-sm font-medium text-white hover:text-primary transition-colors flex items-center"
                                    >
                                        <LogIn className="w-4 h-4 mr-1" />
                                        Log in
                                    </button>
                                    <button
                                        onClick={openSignup}
                                        className="relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                                    >
                                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#63D3F2_50%,#E2CBFF_100%)]" />
                                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-secondary px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all hover:bg-secondary/80">
                                            Get Started
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 right-0 bg-secondary border-b border-white/10 shadow-xl"
                >
                    <div className="px-4 pt-2 pb-6 space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-background/50 rounded-md"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        {user ? (
                            <div className="pt-4 border-t border-white/10 space-y-4">
                                <button
                                    onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-white font-medium flex items-center"
                                >
                                    <User className="w-5 h-5 mr-2" />
                                    {user.name || user.email || 'Dashboard'}
                                </button>
                                <button
                                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-gray-400 font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 border-t border-white/10 space-y-4">
                                <button
                                    onClick={() => { openLogin(); setMobileMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => { openSignup(); setMobileMenuOpen(false); }}
                                    className="w-full bg-primary text-secondary font-bold py-3 rounded-lg text-center"
                                >
                                    Get Started
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </header>
    );
}
