import React from 'react';
import Navbar from './components/Navbar';
import ChatInterface from './components/ChatInterface';
import About from './components/About';
import Cases from './components/Cases';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION - Full Dynamic Viewport Height for Mobile App feel */}
      <section className="relative h-[100dvh] flex flex-col items-center justify-center pt-20 pb-4 px-4 md:pt-24 md:pb-12 md:px-6">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-600/10 rounded-full blur-[80px] md:blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="text-center mb-4 md:mb-12 max-w-4xl mx-auto shrink-0">
            <h1 className="text-4xl md:text-8xl font-display font-bold mb-2 md:mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                NULLXES
            </h1>
            <p className="text-xs md:text-xl text-gray-400 font-light tracking-wide uppercase mb-2 md:mb-8 hidden md:block">
                Future Intelligence Architecture
            </p>
            <p className="text-[10px] md:text-sm text-gray-500 mb-4 md:mb-12">
                Consult with Luna AI below to begin your transformation.
            </p>
        </div>

        {/* LUNA AI & CHAT - Takes remaining space */}
        <div className="flex-1 w-full max-w-6xl min-h-0">
            <ChatInterface />
        </div>

      </section>

      <About />
      <Cases />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;