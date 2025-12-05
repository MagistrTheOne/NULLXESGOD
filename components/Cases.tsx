import React from 'react';

const Cases: React.FC = () => {
  const clients = [
      { name: 'ALIBABA CLOUD', color: 'from-red-500' },
      { name: 'NVIDIA', color: 'from-green-500' }
  ];

  return (
    <section id="cases" className="py-24 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-display font-light mb-12 text-center tracking-widest uppercase text-gray-400">
                Trusted by 
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {clients.map((client, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-2xl glass-panel border border-white/5 hover:border-white/20 transition-all duration-500">
                        {/* Gradient Glow */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${client.color} to-transparent opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700`} />
                        
                        <div className="relative p-12 flex flex-col items-center justify-center text-center">
                            <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 group-hover:to-white transition-all duration-300">
                                {client.name}
                            </h3>
                            <div className="mt-4 w-12 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/50 transition-all duration-500" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default Cases;