import React from 'react';
import { Home, ShieldCheck, Heart, PhoneCall, Globe } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/i18n';

interface FooterProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, setLanguage }) => {
  const t = translations[language];

  return (
    <footer className="bg-stone-900 text-white pt-12 pb-8 border-t border-stone-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold">Haven<span className="text-emerald-400">Home</span></span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Dedicated to creating, managing, and connecting low-income families with affordable, dignified housing options.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 text-[11px] font-semibold border border-stone-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Equal Housing Opportunity</span>
            </div>
          </div>

          {/* Quick Support Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400">Housing Assistance</h4>
            <ul className="space-y-1.5 text-stone-300 font-medium">
              <li>Section 8 Choice Vouchers</li>
              <li>HUD AMI Income Calculator</li>
              <li>Emergency Rental Assistance</li>
              <li>Accessible ADA Housing</li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400">Emergency Hotlines</h4>
            <ul className="space-y-1.5 text-stone-300 font-medium">
              <li className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>211 Local Community Helpline</span>
              </li>
              <li>HUD Housing Helpline: 1-800-569-4287</li>
              <li>Fair Housing Discrimination: 1-800-669-9777</li>
            </ul>
          </div>

          {/* Language Selector */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400">Language Access</h4>
            <p className="text-stone-400">Select your preferred language:</p>
            <div className="flex items-center gap-2 bg-stone-800 border border-stone-700 rounded-xl p-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <select
                id="footer-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer w-full"
              >
                <option value="en" className="bg-stone-900">English</option>
                <option value="es" className="bg-stone-900">Español (Spanish)</option>
                <option value="vi" className="bg-stone-900">Tiếng Việt (Vietnamese)</option>
                <option value="zh" className="bg-stone-900">中文 (Chinese)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} HavenHome Affordable Housing Foundation. All rights reserved.</p>
          <p className="text-center sm:text-right">
            We operate in strict compliance with the Federal Fair Housing Act. $0 application fee for all low-income applicants.
          </p>
        </div>
      </div>
    </footer>
  );
};
