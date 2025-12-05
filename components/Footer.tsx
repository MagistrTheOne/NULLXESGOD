import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 text-sm">
                © 2025 NULLXES. All rights reserved.
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-400 text-sm">Systems Operational</span>
            </div>
            <div className="text-gray-600 text-sm">
                Author: MagistrTheOne
            </div>
        </div>
    </footer>
  );
};

export default Footer;