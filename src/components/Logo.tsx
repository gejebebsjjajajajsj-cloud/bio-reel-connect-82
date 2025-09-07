import React from 'react';
import { useStore } from '@/contexts/StoreContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const { data } = useStore();
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative animate-scale-in`}>
      <div className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center shadow-glow overflow-hidden border-2 border-primary/30">
        {data.logoImage ? (
          <img 
            src={data.logoImage} 
            alt="Logo" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-primary-foreground font-bold text-lg flex flex-col items-center">
            <div className="text-2xl">{data.logo}</div>
            <div className="text-xs mt-1">STYLE</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;