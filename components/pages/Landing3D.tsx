"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '../ui/GlassCard';
import { Zap, Leaf, BarChart3, ArrowRight, ShieldCheck, CheckCircle2, MapPin, Server } from 'lucide-react';
import { Boxes } from '@/components/ui/background-boxes';

interface Landing3DProps {
  onNavigate?: (page: string) => void;
}

export const Landing3D: React.FC<Landing3DProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const featureCards = [
    {
      title: 'System Dashboard',
      desc: 'Monitor operations, performance, and bin health from one central command center.',
      icon: BarChart3,
    },
    {
      title: 'Driver Verify Page',
      desc: 'Enable garbage collectors to validate images and confirm collection status on the go.',
      icon: Zap,
    },
    {
      title: 'Map Overlay',
      desc: 'Visualize bin clusters, alerts, and route priorities with an intuitive city overlay.',
      icon: MapPin,
    },
    {
      title: 'Dustbin Health',
      desc: 'Track battery, fill level, and network health for every smart bin.',
      icon: ShieldCheck,
    },
    {
      title: 'Citizen Report Review',
      desc: 'Validate community-submitted reports quickly with image verification workflows.',
      icon: Server,
    },
  ];

  const navigate = (page: 'landing' | 'login' | 'loginForCollector' | 'overview') => {
    if (onNavigate) {
      onNavigate(page);
      return;
    }
    switch (page) {
      case 'login':
        router.push('/login');
        break;
      case 'loginForCollector':
        router.push('/loginForCollector');
        break;
      case 'overview':
        router.push('/dashboard');
        break;
      default:
        router.push('/');
    }
  };

  const handleBackgroundWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    event.preventDefault();
    containerRef.current.scrollBy({ top: event.deltaY, behavior: 'auto' });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-y-auto bg-slate-950 text-white">
      <div className="fixed inset-0 z-0 bg-slate-900" />
      <div className="fixed inset-0 z-[1] overflow-hidden" onWheel={handleBackgroundWheel}>
        <Boxes className="absolute inset-0" />
      </div>
      <div className="fixed inset-0 z-[2] pointer-events-none bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-5 backdrop-blur-md bg-black/35 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Smart Dustbin</p>
            <h1 className="font-bold text-white text-xl">Waste Intelligence</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('login')}
            className="rounded-full border border-white/20 px-5 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Admin Login
          </button>
          <button
            onClick={() => navigate('loginForCollector')}
            className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Collector Login
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-28 pb-20">
        <section className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 text-center md:px-8">
          <div className="mb-10 rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm uppercase tracking-[0.25em] text-cyan-200">
              <CheckCircle2 className="h-4 w-4" /> Smart operations for waste management
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              The smartest way to run waste collection, verification, and citizen response.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-300 sm:text-xl">
              From dashboard oversight to collector verification, map overlays and health checks, launch a modern waste management experience for cities and communities.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate('overview')}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-8 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:opacity-95"
              >
                Explore dashboard
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('login')}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Start verification
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Performance</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">35% faster response</h2>
              <p className="mt-3 text-sm text-gray-400">Reduce waste collection latency with smarter routing and alerts.</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Verification</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Image-ready workflows</h2>
              <p className="mt-3 text-sm text-gray-400">Approve or flag citizen and camera reports from a single review screen.</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Insight</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Live bin health</h2>
              <p className="mt-3 text-sm text-gray-400">See battery, fill level and network status for each smart bin instantly.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Features</p>
            <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Built for modern waste teams</h2>
            <p className="mx-auto mt-4 max-w-3xl text-gray-400">A complete experience for admins, collectors, and citizens.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => (
              <GlassCard key={feature.title} blur="lg" opacity="low" className="p-8">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-7xl px-6 md:px-8 pb-20">
          <div className="rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-center">
              <div>
                <p className="text-cyan-300 text-sm uppercase tracking-[0.24em]">Why Smart Dustbin</p>
                <h3 className="mt-4 text-4xl font-bold text-white">A unified experience for every role</h3>
                <p className="mt-6 text-xl text-gray-300 max-w-2xl">
                  Drive smarter collections with telemetry-driven decisions, live verification, and community feedback all in one place.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-950/80 p-6 border border-white/10">
                  <p className="text-sm text-cyan-300 uppercase tracking-[0.2em]">Collector focus</p>
                  <p className="mt-3 text-white font-semibold">Image verify mode for quick scene checks.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-6 border border-white/10">
                  <p className="text-sm text-cyan-300 uppercase tracking-[0.2em]">Admin control</p>
                  <p className="mt-3 text-white font-semibold">Operational dashboards that highlight issues.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
