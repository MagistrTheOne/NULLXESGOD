import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contacts" className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl font-display font-bold mb-8">Ready to Scale?</h2>
            <p className="text-xl text-gray-400 mb-12">
                We select our clients carefully. If you are ready for Tier 1 transformation, reach out.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center">
                <a 
                    href="https://t.me/MagistrTheOne" 
                    target="_blank" 
                    rel="noreferrer"
                    className="glass-panel px-8 py-6 rounded-2xl hover:bg-white/10 transition-colors group"
                >
                    <div className="text-sm text-gray-500 mb-2 uppercase tracking-widest">Telegram</div>
                    <div className="text-xl font-bold group-hover:text-blue-400 transition-colors">@MagistrTheOne</div>
                </a>
                
                <a 
                    href="mailto:maxonyushko71@gmail.com" 
                    className="glass-panel px-8 py-6 rounded-2xl hover:bg-white/10 transition-colors group"
                >
                    <div className="text-sm text-gray-500 mb-2 uppercase tracking-widest">Email</div>
                    <div className="text-xl font-bold group-hover:text-purple-400 transition-colors">maxonyushko71@gmail.com</div>
                </a>
            </div>
        </div>
    </section>
  );
};

export default Contact;