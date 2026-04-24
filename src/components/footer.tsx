'use client';

import { Bot } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">REvuBOT AI</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Thailand Guide</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Your intelligent AI travel companion for exploring the Land of Smiles. Get real-time advice on destinations, food, safety, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Tourist Police: 1155', href: 'tel:1155' },
                { label: 'Emergency: 1669', href: 'tel:1669' },
                { label: 'Immigration Bureau', href: '#' },
                { label: 'Thai Embassy Finder', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 text-xs hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Features</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                '5+ Languages',
                '1,200+ Insider Spots',
                'Real-time Alerts',
                'Currency Calculator',
                'Visa Intel',
                '24/7 Support',
              ].map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-slate-400 text-[11px]">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
              v3.1.0
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
              Operations Console • Thailand Innovation Hub
            </span>
          </div>
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} REvuBOT Neural Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
