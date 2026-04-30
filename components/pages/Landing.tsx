'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Zap, Leaf, BarChart3, ArrowRight } from 'lucide-react';

export const Landing: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(26, 26, 26, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0d0d0d]">
      {/* Animated background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Gradient overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl opacity-30" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between w-full mb-20"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Smart Dustbin</h1>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            Sign In
          </button>
        </motion.div>

        {/* Main content */}
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          variants={itemVariants}
        >
          {/* Hero text */}
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Smart Waste <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">Management</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time monitoring and optimization of waste collection. Reduce costs, improve efficiency, and protect the environment.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('login')}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-4xl mt-20"
          variants={itemVariants}
        >
          {[
            {
              icon: BarChart3,
              title: 'Real-time Analytics',
              desc: 'Monitor waste levels and collection metrics in real-time',
            },
            {
              icon: Zap,
              title: 'Smart Optimization',
              desc: 'Optimize routes and reduce operational costs efficiently',
            },
            {
              icon: Leaf,
              title: 'Eco-friendly',
              desc: 'Minimize environmental impact with smart solutions',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={floatingVariants}
              animate="animate"
              custom={i}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <GlassCard blur="lg" opacity="low">
                <feature.icon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex items-center justify-center">
          <div className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
};
