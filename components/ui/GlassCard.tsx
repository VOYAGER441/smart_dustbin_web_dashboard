import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: 'low' | 'medium' | 'high';
}

const blurMap = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const opacityMap = {
  low: 'bg-white/5 border-white/10',
  medium: 'bg-white/10 border-white/20',
  high: 'bg-white/15 border-white/30',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  blur = 'md',
  opacity = 'medium',
}) => {
  return (
    <div
      className={`
        ${blurMap[blur]}
        ${opacityMap[opacity]}
        border
        rounded-2xl
        p-6
        backdrop-saturate-150
        bg-gradient-to-br from-white/20 to-white/5
        shadow-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
};
