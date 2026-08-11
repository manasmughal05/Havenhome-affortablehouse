import React from 'react';
import { Search, ShieldCheck, Building2, Calculator, ArrowRight, FileText, TrendingUp } from 'lucide-react';
import { FilterState, Language } from '../types';
import { translations } from '../data/i18n';

interface HeroSectionProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSearchClick: () => void;
  onCheckEligibilityClick: () => void;
  language: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  filters,
  setFilters,
  onSearchClick,
  onCheckEligibilityClick,
  language,
}) => {
  const t = translations[language];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      {/* Bento Grid Container */}
      <div className="grid grid-cols-12 gap-4">
        {/* Bento Card 1: Main Find Housing Search (Col 8) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            {/* Verification Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>HUD Fair Housing Approved • $0 Fee</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              {t.heroTitle}
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl leading-relaxed">
              {t.heroSubtitle} Enter your preferred location or budget to browse available low-income housing units.
            </p>
          </div>

          {/* Search Bar Container */}
          <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
            <div className="flex-1 flex items-center px-4 gap-2 bg-white rounded-xl shadow-xs border border-slate-100">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                id="hero-search-input"
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && onSearchClick()}
                placeholder={t.searchPlaceholder}
                className="w-full outline-none text-sm h-12 text-slate-900 placeholder-slate-400 font-medium bg-transparent"
              />
            </div>

            <div className="w-full sm:w-44 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center px-2">
              <select
                id="hero-city-select"
                value={filters.city}
                onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full h-12 bg-transparent outline-none font-semibold text-slate-800 text-xs cursor-pointer"
              >
                <option value="">{t.cityAll}</option>
                <option value="Oakland">Oakland, CA</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Los Angeles">Los Angeles, CA</option>
                <option value="Chicago">Chicago, IL</option>
                <option value="San Jose">San Jose, CA</option>
                <option value="Austin">Austin, TX</option>
              </select>
            </div>

            <button
              id="hero-search-btn"
              onClick={onSearchClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{t.searchBtn}</span>
            </button>
          </div>

          {/* Quick Filter Pill Badges */}
          <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="text-slate-400 font-medium">Filter By:</span>
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, section8Only: !prev.section8Only }));
                onSearchClick();
              }}
              className={`px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                filters.section8Only
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
            >
              ✓ Section 8 Accepted
            </button>
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, amiCategory: prev.amiCategory === '30%' ? 'all' : '30%' }));
                onSearchClick();
              }}
              className={`px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                filters.amiCategory === '30%'
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
            >
              30% Extremely Low Income
            </button>
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, waitlistStatus: prev.waitlistStatus === 'immediate' ? 'all' : 'immediate' }));
                onSearchClick();
              }}
              className={`px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                filters.waitlistStatus === 'immediate'
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
            >
              ⚡ Immediate Openings
            </button>
          </div>

          {/* Ambient Glow Background Accent */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        </div>

        {/* Bento Card 2: Easy Application Portal Highlight (Col 4) */}
        <div className="col-span-12 lg:col-span-4 bg-emerald-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg shadow-emerald-900/20">
          <div>
            <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center mb-6 border border-emerald-700">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 leading-tight">Easy Application Portal</h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed mb-6">
              Apply for multiple housing communities with a single profile. $0 fee & instant HUD eligibility checks.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                Verify Household AMI Tier
              </li>
              <li className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                Upload Income Verification Papers
              </li>
              <li className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                Submit to Waitlists Simultaneously
              </li>
            </ul>
          </div>

          <button
            id="hero-check-eligibility-btn"
            onClick={onCheckEligibilityClick}
            className="w-full bg-white text-emerald-950 hover:bg-emerald-50 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-center mt-6 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-emerald-700" />
            <span>Check Income Eligibility</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>

        {/* Bento Card 3: Availability Heatmap (Col 4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Availability Heatmap</h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Live Updates</span>
          </div>
          <div className="flex-1 bg-slate-100 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center gap-3 relative min-h-[110px]">
            <div className="grid grid-cols-8 gap-1.5 w-full justify-items-center">
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-100" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-300" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-600" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-100" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-400" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-500" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-200" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-700" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-400" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-600" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-200" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-100" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-500" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-100" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-600" />
              <div className="w-3.5 h-3.5 rounded-xs bg-emerald-300" />
            </div>
            <div className="flex items-center justify-between w-full text-[11px] font-bold text-slate-600 pt-1">
              <span>Verified Openings</span>
              <span className="text-emerald-700 font-extrabold">4,200+ Active Units</span>
            </div>
          </div>
        </div>

        {/* Bento Card 4: Our Impact Stat (Col 4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Our Housing Impact</h3>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">12,400+</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Low-income families housed with dignity</div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white text-slate-600 text-[10px] font-bold flex items-center justify-center">MR</div>
              <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white text-emerald-800 text-[10px] font-bold flex items-center justify-center">JS</div>
              <div className="w-8 h-8 rounded-full bg-teal-200 border-2 border-white text-teal-800 text-[10px] font-bold flex items-center justify-center">AL</div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-emerald-800">+2k</div>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Verified Residents</span>
          </div>
        </div>

        {/* Bento Card 5: Market Trends & HUD Guidelines (Col 4) */}
        <div className="col-span-12 lg:col-span-4 bg-indigo-50 rounded-3xl border border-indigo-100 p-6 flex items-center gap-4 shadow-sm text-indigo-900">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-950">HUD 2026 AMI Guidelines Active</h4>
            <p className="text-xs text-indigo-800 leading-snug mt-0.5">
              Income caps updated for 30%, 50%, and 80% AMI tiers across all CA, IL, and TX metros.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

