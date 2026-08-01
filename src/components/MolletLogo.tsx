import React from 'react';

interface MolletLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const MolletLogo: React.FC<MolletLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-lg', icon: 'w-5 h-5', title: 'text-lg', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10 rounded-xl', icon: 'w-6 h-6', title: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-8 h-8', title: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-20 h-20 rounded-3xl', icon: 'w-12 h-12', title: 'text-4xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Refined Corporate Burgundy Box with Crisp Booklet Globe Emblem */}
      <div className={`${currentSize.box} bg-gradient-to-br from-[#851428] via-[#751123] to-[#590d1a] shadow-md shadow-black/20 flex items-center justify-center shrink-0 border border-white/20`}>
        <svg
          className={`${currentSize.icon} text-white fill-none`}
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Booklet Front Cover */}
          <rect x="10" y="8" width="18" height="30" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
          {/* Back Pages */}
          <path d="M28 14H35C36.1 14 37 14.9 37 16V34C37 35.1 36.1 36 35 36H28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <line x1="28" y1="20" x2="33" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="26" x2="33" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Globe inside Front Cover */}
          <circle cx="19" cy="23" r="5.5" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M13.5 23H24.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M19 17.5C20.4 19.2 20.4 26.8 19 28.5C17.6 26.8 17.6 19.2 19 17.5Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-slate-900 dark:text-white font-sans ${currentSize.title}`}>
              MOLLET<span className="text-[#851428] dark:text-[#e11d48] font-black ml-1">CAPITAL</span>
            </span>
          </div>
          <p className={`${currentSize.sub} font-bold uppercase tracking-wider text-[#851428] dark:text-rose-400`}>
            Shariah Stock Screener
          </p>
        </div>
      )}
    </div>
  );
};

