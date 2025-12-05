import React from 'react';

interface LunaVisualizerProps {
  state: 'idle' | 'listening' | 'speaking' | 'thinking';
}

const LunaVisualizer: React.FC<LunaVisualizerProps> = ({ state }) => {
  // Dynamic classes based on state
  const getGlowColor = () => {
    switch(state) {
      case 'listening': return 'shadow-[0_0_50px_rgba(34,211,238,0.6)] border-cyan-400';
      case 'speaking': return 'shadow-[0_0_60px_rgba(167,139,250,0.8)] border-purple-400 animate-pulse';
      case 'thinking': return 'shadow-[0_0_40px_rgba(255,255,255,0.5)] border-white animate-spin';
      default: return 'shadow-[0_0_30px_rgba(255,255,255,0.2)] border-white/20';
    }
  };

  return (
    <div className="relative w-40 h-40 md:w-64 md:h-64 mx-auto flex items-center justify-center transition-all duration-300">
      {/* Outer Rings */}
      <div className={`absolute inset-0 rounded-full border border-white/10 ${state === 'speaking' ? 'animate-ping opacity-20' : ''}`} />
      <div className={`absolute inset-2 md:inset-4 rounded-full border border-white/5 ${state === 'listening' ? 'scale-110 duration-1000 transition-transform' : ''}`} />

      {/* Main Sphere */}
      <div className={`
        relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full 
        bg-black border-2 
        flex items-center justify-center
        transition-all duration-500
        ${getGlowColor()}
        animate-float
      `}>
        {/* Inner Core */}
        <div className={`
          w-16 h-16 md:w-24 md:h-24 rounded-full 
          bg-gradient-to-tr from-black via-gray-900 to-white/10
          overflow-hidden relative
        `}>
           {/* Abstract "AI" lines */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
           <div className={`absolute w-full h-full bg-gradient-to-t from-transparent via-white/5 to-transparent animate-scan`} />
        </div>
      </div>
      
      {/* Label - IDLE text removed */}
      <div className="absolute -bottom-8 md:-bottom-12 text-center">
        <h3 className="text-lg md:text-xl font-display font-bold tracking-widest text-white">LUNA AI</h3>
      </div>
    </div>
  );
};

export default LunaVisualizer;