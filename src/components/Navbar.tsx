import React from 'react';
import { Home, Search, Calculator, FileText, SearchCheck, Bot, LifeBuoy, Heart, Globe, PhoneCall } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/i18n';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  savedCount: number;
  openSavedModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  savedCount,
  openSavedModal,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Emergency Notice Hotline Banner */}
      <div className="bg-emerald-900 text-white text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 font-medium">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>{t.emergencyNotice}</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-200">
            <span className="hidden sm:inline">Section 8 Vouchers Accepted</span>
            <span className="text-emerald-400">•</span>
            <span className="font-semibold text-emerald-100">$0 Application Fee</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand Name */}
          <div
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:bg-emerald-700 transition-colors">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-stone-900 tracking-tight">Haven<span className="text-emerald-600">Home</span></span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
                  HUD Verified
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Nav Tabs Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-search-tab"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t.navFindHousing}</span>
            </button>

            <button
              id="nav-eligibility-tab"
              onClick={() => setActiveTab('eligibility')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'eligibility'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>{t.navEligibility}</span>
            </button>

            <button
              id="nav-apply-tab"
              onClick={() => setActiveTab('apply')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'apply'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.navApply}</span>
            </button>

            <button
              id="nav-tracker-tab"
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'tracker'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <SearchCheck className="w-4 h-4" />
              <span>{t.navTracker}</span>
            </button>

            <button
              id="nav-advisor-tab"
              onClick={() => setActiveTab('advisor')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'advisor'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>{t.navAdvisor}</span>
            </button>

            <button
              id="nav-resources-tab"
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'resources'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              <span>{t.navResources}</span>
            </button>
          </nav>

          {/* Right Controls: Saved listings & Language Switcher */}
          <div className="flex items-center gap-2">
            {/* Saved Listings Button */}
            <button
              id="saved-listings-btn"
              onClick={openSavedModal}
              className="relative p-2 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1"
              title={t.savedListings}
            >
              <Heart className={`w-5 h-5 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {savedCount > 0 && (
                <span className="bg-rose-500 text-white text-[11px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold text-stone-700">
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-stone-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="vi">Tiếng Việt</option>
                <option value="zh">中文 (Chinese)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="md:hidden flex items-center justify-between px-2 py-2 bg-stone-50 border-t border-stone-200 overflow-x-auto text-xs font-semibold gap-1">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-2.5 py-1.5 rounded-md flex items-center gap-1 whitespace-nowrap ${
            activeTab === 'search' ? 'bg-emerald-600 text-white' : 'text-stone-700'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>{t.navFindHousing}</span>
        </button>
        <button
          onClick={() => setActiveTab('eligibility')}
          className={`px-2.5 py-1.5 rounded-md flex items-center gap-1 whitespace-nowrap ${
            activeTab === 'eligibility' ? 'bg-emerald-600 text-white' : 'text-stone-700'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{t.navEligibility}</span>
        </button>
        <button
          onClick={() => setActiveTab('apply')}
          className={`px-2.5 py-1.5 rounded-md flex items-center gap-1 whitespace-nowrap ${
            activeTab === 'apply' ? 'bg-emerald-600 text-white' : 'text-stone-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t.navApply}</span>
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-2.5 py-1.5 rounded-md flex items-center gap-1 whitespace-nowrap ${
            activeTab === 'tracker' ? 'bg-emerald-600 text-white' : 'text-stone-700'
          }`}
        >
          <SearchCheck className="w-3.5 h-3.5" />
          <span>{t.navTracker}</span>
        </button>
        <button
          onClick={() => setActiveTab('advisor')}
          className={`px-2.5 py-1.5 rounded-md flex items-center gap-1 whitespace-nowrap ${
            activeTab === 'advisor' ? 'bg-emerald-600 text-white' : 'text-stone-700'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Help</span>
        </button>
      </div>
    </header>
  );
};
