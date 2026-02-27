import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Wallet, ArrowRight, Loader2, User } from 'lucide-react';
import { useAuth } from '../../routes/AuthContext';
import { authApi } from '../../services/api';
import { ethers } from 'ethers';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'signup', 'web3'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, loginWithWeb3 } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'signup') {
        await signup(email, password, name);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeb3Auth = async () => {
    setError('');
    setIsLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found. Please install the extension.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // 1. Get Nonce
      const { data: { nonce } } = await authApi.getNonce(walletAddress);

      // 2. Sign Message
      const message = `Sign this message to authenticate with FinSightAI. Nonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      // 3. Verify
      await loginWithWeb3(walletAddress, signature);
      onClose();
    } catch (err) {
      setError(err.message || 'Web3 authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-secondary border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Connect Wallet'}
              </h2>
              <p className="text-gray-400">
                {mode === 'login' ? 'Access your financial intelligence' : mode === 'signup' ? 'Start your journey with FinSightAI' : 'Sign in securely with Web3'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {mode !== 'web3' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-background/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-background/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-secondary font-bold py-3 rounded-lg hover:bg-white transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleWeb3Auth}
                  disabled={isLoading}
                  className="w-full bg-[#f6851b] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Mirror_Logo.svg" alt="MetaMask" className="w-6 h-6" />
                      <span>Connect MetaMask</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="mt-8 flex flex-col space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-secondary px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              {mode !== 'web3' ? (
                <button
                  onClick={() => setMode('web3')}
                  className="w-full bg-white/5 border border-white/10 text-white font-medium py-2.5 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                >
                  <Wallet className="w-4 h-4 text-primary" />
                  <span>Web3 Wallet</span>
                </button>
              ) : (
                <button
                  onClick={() => setMode('login')}
                  className="w-full bg-white/5 border border-white/10 text-white font-medium py-2.5 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  <span>Email Address</span>
                </button>
              )}

              <p className="text-center text-sm text-gray-400">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary hover:underline font-medium"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
