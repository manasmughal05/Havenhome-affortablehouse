import React from 'react';
import { Search, SlidersHorizontal, Map, LayoutGrid, RotateCcw, ShieldCheck, DollarSign, Bed, Sparkles } from 'lucide-react';
import { FilterState, Language } from '../types';
import { translations } from '../data/i18n';

interface PropertySearchProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  viewMode: 'grid' | 'map';
  setViewMode: (mode: 'grid' | 'map') => void;
  totalResults: number;
  language: Language;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({
  filters,
  setFilters,
  resetFilters,
  viewMode,
  setViewMode,
  totalResults,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm mb-6">
      {/* Search Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">Find Low-Income Affordable Communities</h2>
            <p className="text-xs text-stone-500 font-medium">
              Showing <span className="font-bold text-emerald-700">{totalResults}</span> verified housing communities
            </p>
          </div>
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center justify-between lg:justify-end gap-3">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
            <span className="hidden sm:inline">Sort:</span>
            <select
              id="sort-by-select"
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="rent-low">Lowest Rent First</option>
              <option value="rent-high">Highest Rent</option>
              <option value="walk-score">Highest Walk & Transit Score</option>
              <option value="newest">Newest Constructed</option>
            </select>
          </div>

          {/* Grid / Map Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              id="view-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              id="view-map-btn"
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'map' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Interactive Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {/* Search Query */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>Keyword / Address</span>
          </label>
          <input
            id="filter-keyword-input"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="City, neighborhood, or zip..."
            className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Bedrooms Dropdown */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bedrooms Needed</span>
          </label>
          <select
            id="filter-bedrooms-select"
            value={filters.bedrooms}
            onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))}
            className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Any Bedroom Count</option>
            <option value="0">Studio / SRO</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3+">3+ Bedrooms</option>
          </select>
        </div>

        {/* HUD AMI Income Category */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>HUD Income Level (AMI)</span>
          </label>
          <select
            id="filter-ami-select"
            value={filters.amiCategory}
            onChange={(e) => setFilters((prev) => ({ ...prev, amiCategory: e.target.value }))}
            className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Income Levels</option>
            <option value="30%">30% AMI (Extremely Low Income)</option>
            <option value="50%">50% AMI (Very Low Income)</option>
            <option value="60%">60% AMI (Workforce Housing)</option>
            <option value="80%">80% AMI (Low Income)</option>
          </select>
        </div>

        {/* Max Monthly Rent Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.maxRentLabel}</span>
            </label>
            <span className="text-xs font-extrabold text-emerald-700">${filters.maxRent}/mo</span>
          </div>
          <input
            id="filter-max-rent-slider"
            type="range"
            min={400}
            max={2000}
            step={50}
            value={filters.maxRent}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxRent: Number(e.target.value) }))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Toggle Checkboxes Row */}
      <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-stone-700">
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              id="filter-section8-checkbox"
              type="checkbox"
              checked={filters.section8Only}
              onChange={(e) => setFilters((prev) => ({ ...prev, section8Only: e.target.checked }))}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t.section8Filter}
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              id="filter-wheelchair-checkbox"
              type="checkbox"
              checked={filters.wheelchairOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, wheelchairOnly: e.target.checked }))}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 cursor-pointer"
            />
            <span>{t.accessibleFilter}</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              id="filter-pets-checkbox"
              type="checkbox"
              checked={filters.petsOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, petsOnly: e.target.checked }))}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 cursor-pointer"
            />
            <span>{t.petFilter}</span>
          </label>
        </div>

        {/* Reset Filters */}
        <button
          id="reset-filters-btn"
          onClick={resetFilters}
          className="text-stone-500 hover:text-stone-800 flex items-center gap-1 font-semibold underline underline-offset-2 transition-colors ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetBtn}</span>
        </button>
      </div>
    </div>
  );
};
