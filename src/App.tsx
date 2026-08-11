import React, { useState, useMemo } from 'react';
import { Property, FilterState, Language, HousingApplication } from './types';
import { mockProperties } from './data/mockProperties';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertySearch } from './components/PropertySearch';
import { PropertyCard } from './components/PropertyCard';
import { PropertyModal } from './components/PropertyModal';
import { InteractiveMap } from './components/InteractiveMap';
import { EligibilityCalculator } from './components/EligibilityCalculator';
import { ApplicationPortal } from './components/ApplicationPortal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { AiHousingAdvisor } from './components/AiHousingAdvisor';
import { ResourceHub } from './components/ResourceHub';
import { Footer } from './components/Footer';
import { Heart, X, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('search');
  const [language, setLanguage] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    city: '',
    maxRent: 2000,
    bedrooms: 'all',
    amiCategory: 'all',
    waitlistStatus: 'all',
    section8Only: false,
    wheelchairOnly: false,
    petsOnly: false,
    utilitiesIncludedOnly: false,
    sortBy: 'rent-low',
  });

  // Saved / Bookmarked Property IDs
  const [savedIds, setSavedIds] = useState<string[]>(['prop-1']);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);

  // Property Modal details
  const [selectedModalProperty, setSelectedModalProperty] = useState<Property | null>(null);

  // Application pre-selected property
  const [applicationProperty, setApplicationProperty] = useState<Property | null>(null);

  // Application submitted tracking state
  const [submittedApp, setSubmittedApp] = useState<HousingApplication | null>(null);

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return mockProperties
      .filter((p) => {
        // Keyword Search
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          const matchAddress = p.address.toLowerCase().includes(q);
          const matchZip = p.zipCode.includes(q);
          const matchNeighborhood = p.neighborhood.toLowerCase().includes(q);
          if (!matchName && !matchCity && !matchAddress && !matchZip && !matchNeighborhood) return false;
        }

        // City
        if (filters.city && p.city.toLowerCase() !== filters.city.toLowerCase()) return false;

        // Max Rent
        if (p.minRent > filters.maxRent) return false;

        // Bedrooms
        if (filters.bedrooms !== 'all') {
          const reqBeds = filters.bedrooms === '3+' ? 3 : Number(filters.bedrooms);
          const hasBed = p.units.some((u) => u.bedrooms >= reqBeds);
          if (!hasBed) return false;
        }

        // AMI Category
        if (filters.amiCategory !== 'all') {
          const reqAmi = filters.amiCategory + ' AMI';
          if (!p.amiCategories.some((a) => a.includes(filters.amiCategory))) return false;
        }

        // Waitlist Status
        if (filters.waitlistStatus === 'immediate' && p.waitlistStatus !== 'Immediate Availability') return false;
        if (filters.waitlistStatus === 'open' && p.waitlistStatus !== 'Open Waitlist') return false;

        // Checkboxes
        if (filters.section8Only && !p.acceptsSection8) return false;
        if (filters.wheelchairOnly && p.accessibilityFeatures.length === 0) return false;
        if (filters.petsOnly && !p.petFriendly) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'rent-low') return a.minRent - b.minRent;
        if (filters.sortBy === 'rent-high') return b.minRent - a.minRent;
        if (filters.sortBy === 'walk-score') return b.walkScore - a.walkScore;
        if (filters.sortBy === 'newest') return b.builtYear - a.builtYear;
        return 0;
      });
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      city: '',
      maxRent: 2000,
      bedrooms: 'all',
      amiCategory: 'all',
      waitlistStatus: 'all',
      section8Only: false,
      wheelchairOnly: false,
      petsOnly: false,
      utilitiesIncludedOnly: false,
      sortBy: 'rent-low',
    });
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleApplyProperty = (prop: Property) => {
    setApplicationProperty(prop);
    setActiveTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicationSubmitted = (app: HousingApplication) => {
    setSubmittedApp(app);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const savedPropertiesList = mockProperties.filter((p) => savedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        savedCount={savedIds.length}
        openSavedModal={() => setIsSavedDrawerOpen(true)}
      />

      <main className="flex-1 pb-12">
        {/* TAB 1: Search & Browse Housing */}
        {activeTab === 'search' && (
          <div className="space-y-8">
            <HeroSection
              filters={filters}
              setFilters={setFilters}
              onSearchClick={() => {
                const searchElem = document.getElementById('housing-results-section');
                if (searchElem) searchElem.scrollIntoView({ behavior: 'smooth' });
              }}
              onCheckEligibilityClick={() => setActiveTab('eligibility')}
              language={language}
            />

            <div id="housing-results-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <PropertySearch
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
                viewMode={viewMode}
                setViewMode={setViewMode}
                totalResults={filteredProperties.length}
                language={language}
              />

              {/* Grid or Map Render */}
              {viewMode === 'grid' ? (
                filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        onSelect={(p) => setSelectedModalProperty(p)}
                        onApply={handleApplyProperty}
                        isSaved={savedIds.includes(prop.id)}
                        onToggleSave={toggleSave}
                        language={language}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4 max-w-xl mx-auto my-8">
                    <Building2 className="w-12 h-12 text-stone-400 mx-auto" />
                    <h3 className="text-lg font-bold text-stone-900">No properties matched your search criteria</h3>
                    <p className="text-xs text-stone-500">
                      Try expanding your max rent range or clearing some filter toggles to view available communities.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                    >
                      Reset Filters
                    </button>
                  </div>
                )
              ) : (
                <InteractiveMap
                  properties={filteredProperties}
                  onSelectProperty={(p) => setSelectedModalProperty(p)}
                  onApplyProperty={handleApplyProperty}
                  savedPropertyIds={savedIds}
                  onToggleSave={toggleSave}
                  language={language}
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HUD Eligibility Calculator */}
        {activeTab === 'eligibility' && (
          <EligibilityCalculator
            onSelectProperty={(p) => setSelectedModalProperty(p)}
            onApplyProperty={handleApplyProperty}
            language={language}
          />
        )}

        {/* TAB 3: Easy Application Portal */}
        {activeTab === 'apply' && (
          <ApplicationPortal
            initialProperty={applicationProperty}
            onApplicationSubmitted={handleApplicationSubmitted}
            language={language}
          />
        )}

        {/* TAB 4: Application Tracker Dashboard */}
        {activeTab === 'tracker' && (
          <ApplicationTracker
            currentApplication={submittedApp}
            language={language}
          />
        )}

        {/* TAB 5: AI Housing Advisor */}
        {activeTab === 'advisor' && (
          <AiHousingAdvisor language={language} />
        )}

        {/* TAB 6: Resources & Rights */}
        {activeTab === 'resources' && (
          <ResourceHub language={language} />
        )}
      </main>

      {/* Property Details Modal Popup */}
      <PropertyModal
        property={selectedModalProperty}
        onClose={() => setSelectedModalProperty(null)}
        onApply={handleApplyProperty}
        isSaved={selectedModalProperty ? savedIds.includes(selectedModalProperty.id) : false}
        onToggleSave={toggleSave}
        language={language}
      />

      {/* Saved Properties Drawer Modal */}
      {isSavedDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                  <h3 className="font-extrabold text-stone-900 text-lg">Saved Communities ({savedPropertiesList.length})</h3>
                </div>
                <button
                  onClick={() => setIsSavedDrawerOpen(false)}
                  className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                {savedPropertiesList.length > 0 ? (
                  savedPropertiesList.map((p) => (
                    <div key={p.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex gap-3 items-center">
                      <img src={p.imageUrl} alt="" referrerPolicy="no-referrer" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-stone-900 text-xs truncate">{p.name}</h4>
                        <p className="text-[11px] text-stone-500">{p.city}</p>
                        <p className="text-xs font-black text-emerald-800">${p.minRent}/mo</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsSavedDrawerOpen(false);
                          setSelectedModalProperty(p);
                        }}
                        className="p-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                      >
                        View
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-500 text-center py-8">
                    No properties saved yet. Click the heart icon on any card to save listings.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsSavedDrawerOpen(false)}
              className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl text-xs mt-4"
            >
              Close Saved Drawer
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
