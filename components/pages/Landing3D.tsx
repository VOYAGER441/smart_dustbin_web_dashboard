"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Zap, Leaf, BarChart3, ArrowRight, ShieldCheck, Route, CheckCircle2 } from 'lucide-react';
import { Boxes } from '@/components/ui/background-boxes';

interface Landing3DProps {
  onNavigate?: (page: string) => void;
}

export const Landing3D: React.FC<Landing3DProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const features = [
    {
      icon: BarChart3,
      title: 'Live Bin Visibility',
      desc: 'Track fill levels and collection status across all locations in real time.',
    },
    {
      icon: Zap,
      title: 'Optimized Collection Routes',
      desc: 'Prioritize critical bins automatically and reduce trip cost with smart routing.',
    },
    {
      icon: ShieldCheck,
      title: 'Reliable Operations',
      desc: 'Get alerts, reporting, and traceable actions for every collection cycle.',
    },
  ];

  const navigate = (page: 'landing' | 'login' | 'overview') => {
    if (onNavigate) {
      onNavigate(page);
      return;
    }

    if (page === 'login') {
      router.push('/login');
      return;
    }

    if (page === 'overview') {
      router.push('/dashboard');
      return;
    }

    router.push('/');
  };

  return (
    <div ref={containerRef} className="relative h-screen overflow-y-auto bg-slate-950">
      <div className="fixed inset-0 z-0 bg-slate-900" />
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <Boxes className="absolute inset-0" />
      </div>
      <div className="fixed inset-0 z-[2] pointer-events-none bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-6 backdrop-blur-md bg-black/35 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Smart Dustbin</h1>
        </div>
        <button
          onClick={() => navigate('login')}
          className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
        >
          Sign In
        </button>
      </nav>

      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-24">
        <motion.div
          className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300 mb-6">
            <CheckCircle2 className="w-4 h-4" />
            Smart Dustbin Platform
          </p>

          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
            Professional Waste Operations
            <span className="block bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
              in One Dashboard
            </span>
          </h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mt-6 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Monitor bins, automate priorities, and run cleaner collection routes with a focused, reliable control center.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button
              onClick={() => navigate('login')}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold overflow-hidden hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
                onClick={() => {
                  if (!containerRef.current) return;
                  containerRef.current.scrollTo({ top: containerRef.current.clientHeight, behavior: 'smooth' });
                }}
              className="px-8 py-4 rounded-full border-2 border-cyan-400/50 text-cyan-400 font-semibold hover:bg-cyan-400/10 transition-colors"
            >
              Explore Features
            </button>
          </motion.div>

          <div className="mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            <div className="rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-left">
              <p className="text-cyan-300 text-sm">Collection response</p>
              <p className="text-white font-semibold">Up to 35% faster</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-left">
              <p className="text-cyan-300 text-sm">Operational cost</p>
              <p className="text-white font-semibold">Route-aware savings</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-left">
              <p className="text-cyan-300 text-sm">Deployment model</p>
              <p className="text-white font-semibold">IoT + Dashboard ready</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-white text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            Built for Real-World Teams
          </motion.h2>

          <motion.p
            className="text-center text-gray-400 mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            A clean workflow from sensor data to dispatch decisions.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full justify-items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: false, amount: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <GlassCard blur="lg" opacity="medium" className="h-full">
                  <feature.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-3 text-center">{feature.title}</h3>
                  <p className="text-sm text-gray-400 text-center">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-6">
              <p className="text-white text-lg font-semibold mb-2">Operational Clarity</p>
              <p className="text-gray-400 mb-4">See what needs action now and what can wait, without switching tools.</p>
              <div className="inline-flex items-center gap-2 text-cyan-300">
                <Route className="w-4 h-4" />
                Route priorities in one place
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-6">
              <p className="text-white text-lg font-semibold mb-2">Audit-Ready Reporting</p>
              <p className="text-gray-400 mb-4">Track actions and trends with reports prepared for management and compliance.</p>
              <div className="inline-flex items-center gap-2 text-cyan-300">
                <BarChart3 className="w-4 h-4" />
                Live metrics and history
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden pb-20">
        <motion.div
          className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            Ready to launch smarter collections?
          </motion.h2>

          <motion.p
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            Sign in and start operating with cleaner priorities, better visibility, and faster decisions.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            <button
              onClick={() => navigate('login')}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold overflow-hidden hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              <span className="relative z-10">Open Dashboard</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                if (!containerRef.current) return;
                containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-full border-2 border-cyan-400/50 text-cyan-400 font-semibold hover:bg-cyan-400/10 transition-colors"
            >
              Back to Top
            </button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};
