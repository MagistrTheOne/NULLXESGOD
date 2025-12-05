import React from 'react';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-900/10 blur-[150px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-display font-bold mb-4">Investment Plans</h2>
                <p className="text-gray-400">Minimum Engagement: $1,500 / 110,000 RUB</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {['PRO', 'BUSINESS', 'ENTERPRISE'].map((tier, i) => (
                    <div key={tier} className={`glass-panel p-8 rounded-3xl flex flex-col ${i === 1 ? 'border-white/30 bg-white/5' : 'border-white/10'}`}>
                        <div className="text-sm font-bold text-gray-500 mb-4 tracking-widest">{tier}</div>
                        <div className="text-3xl font-display font-bold mb-8">
                            {i === 0 ? '$1,500+' : i === 1 ? '$5,000+' : 'Custom'}
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-gray-300">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                {i === 0 ? 'Standard Integration' : 'Advanced AI Agents'}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                {i === 2 ? 'Full Source Code' : 'Cloud Hosting'}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                Luna AI Support
                            </li>
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-bold transition-all">
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default Pricing;