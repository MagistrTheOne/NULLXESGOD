import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-5xl font-display font-bold mb-8">Pioneer in AI Solutions</h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                        NULLXES establishes itself as a Tier 1 leader in the 2025 Q4 market. We don't just build websites; we engineer intelligence. 
                        Our methodology combines cutting-edge generative AI with robust enterprise architecture.
                    </p>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        From predictive analytics to autonomous agents like Luna, we define the future of digital interaction.
                    </p>
                </div>
                <div className="relative">
                     <div className="glass-panel rounded-3xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                         <div className="flex items-center gap-4 mb-6">
                             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-bold text-xl">N</div>
                             <div>
                                 <h4 className="font-bold">NULLXES LLC & HQ </h4>
                                 <p className="text-xs text-gray-400">Krasnodar | Global HQ</p>
                             </div>
                         </div>
                         <div className="space-y-4">
                             <div className="h-2 bg-white/10 rounded-full w-full" />
                             <div className="h-2 bg-white/10 rounded-full w-3/4" />
                             <div className="h-2 bg-white/10 rounded-full w-5/6" />
                         </div>
                         <div className="mt-8 flex justify-between items-end">
                             <div className="text-4xl font-display font-bold">2025-2026</div>
                             <div className="text-sm text-green-400 font-mono">TIER 1 RATED</div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default About;