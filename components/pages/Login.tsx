'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Mail, Lock, Leaf, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onNavigate?: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const navigate = (page: 'landing' | 'overview') => {
    if (onNavigate) {
      onNavigate(page);
      return;
    }

    router.push(page === 'overview' ? '/dashboard' : '/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email && password) {
      navigate('overview');
    }
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center px-4">
      {/* Gradient overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl opacity-30" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-md space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="flex flex-col items-center gap-4" variants={itemVariants}>
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-2xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Leaf className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white text-center">Welcome Back</h1>
            <p className="text-gray-400 text-center mt-2">Sign in to your Smart Dustbin account</p>
          </div>
        </motion.div>

        {/* Login form */}
        <motion.div variants={itemVariants}>
          <GlassCard blur="xl" opacity="high">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-colors"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-white/10 border border-white/20 rounded cursor-pointer accent-cyan-400"
                  />
                  <span className="text-gray-400">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 mt-6 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>
          </GlassCard>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="text-gray-500 text-sm">or continue with</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

        {/* Social login */}
        <motion.div variants={itemVariants} className="flex gap-4">
          {['Google', 'Microsoft'].map((provider) => (
            <button
              key={provider}
              className="flex-1 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              {provider}
            </button>
          ))}
        </motion.div>

        {/* Sign up link */}
        <motion.div
          variants={itemVariants}
          className="text-center text-sm text-gray-400"
        >
          Don&apos;t have an account?{" "}
          <button className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
            Sign up
          </button>
        </motion.div>

        {/* Back button */}
        <motion.button
          variants={itemVariants}
          onClick={() => navigate('landing')}
          className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};
