import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const NavItem = ({ label, target }: { label: string; target: string }) => (
    <button 
      onClick={() => scrollTo(target)} 
      className="relative group px-2 py-1"
    >
        <span className="relative z-10 block transition-all duration-300 group-hover:text-white group-hover:scale-110 group-hover:font-semibold tracking-wide">
            {label}
        </span>
        <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-300 ease-out -translate-x-1/2 group-hover:w-full opacity-50 group-hover:opacity-100"></span>
        <span className="absolute inset-0 bg-white/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-50 group-hover:scale-110"></span>
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl md:rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20 transition-all duration-300 hover:border-white/20 hover:bg-black/70 relative">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="relative">
                <div className="w-3 h-3 bg-white rounded-full relative z-10 group-hover:shadow-[0_0_12px_white] transition-shadow duration-300" />
                <div className="absolute inset-0 bg-white/50 rounded-full animate-ping opacity-0 group-hover:opacity-50" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-white group-hover:text-gray-200 transition-colors">NULLXES</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <NavItem label="ABOUT" target="about" />
            <NavItem label="CASES" target="cases" />
            <NavItem label="PRICING" target="pricing" />
        </div>

        {/* Contact CTA (Desktop) */}
        <button 
            onClick={() => scrollTo('contacts')} 
            className="hidden md:block group relative bg-white text-black px-6 py-2 rounded-full text-sm font-bold overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
        >
            <span className="relative z-10 group-hover:text-black transition-colors">CONTACT</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite] group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        </button>

        {/* Mobile Burger Button */}
        <button 
          className="md:hidden p-2 text-white/80 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 md:hidden animate-[float_0.3s_ease-out]">
            <button onClick={() => scrollTo('about')} className="text-left py-3 border-b border-white/5 text-gray-300 hover:text-white">ABOUT</button>
            <button onClick={() => scrollTo('cases')} className="text-left py-3 border-b border-white/5 text-gray-300 hover:text-white">CASES</button>
            <button onClick={() => scrollTo('pricing')} className="text-left py-3 border-b border-white/5 text-gray-300 hover:text-white">PRICING</button>
            <button onClick={() => scrollTo('contacts')} className="text-left py-3 text-white font-bold bg-white/10 rounded-xl text-center mt-2">CONTACT US</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;