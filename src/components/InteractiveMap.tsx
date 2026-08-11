import React, { useState } from 'react';
import { Property, Language } from '../types';
import { MapPin, Building, ArrowRight, ShieldCheck, Heart, Sparkles, Navigation } from 'lucide-react';
import { translations } from '../data/i18n';

interface InteractiveMapProps {
  properties: Property[];
  onSelectProperty: (prop: Property) => void;
  onApplyProperty: (prop: Property) => void;
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  language: Language;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  onSelectProperty,
  onApplyProperty,
  savedPropertyIds,
  onToggleSave,
  language,
}) => {
  const t = translations[language];
  const [activePin, setActivePin] = useState<Property | null>(properties[0] || null);

  return (
    <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-2xl relative min-h-[550px] flex flex-col lg:flex-row text-white">
      {/* Map Interactive Canvas */}
      <div className="relative flex-1 bg-stone-950 p-6 flex flex-col justify-between min-h-[400px]">
        {/* Decorative Map Grid Styling */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

        {/* Top Control Bar */}
        <div className="relative z-10 flex items-center justify-between bg-stone-900/90 backdrop-blur-md p-3 rounded-2xl border border-stone-800 shadow-md">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-stone-200">Interactive Housing Map</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{properties.length} Available Locations</span>
          </div>
        </div>

        {/* Map Pin Plot Area */}
        <div className="relative z-10 my-auto py-12 px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {properties.map((prop, index) => {
            const isSelected = activePin?.id === prop.id;
            return (
              <button
                key={prop.id}
                id={`map-pin-${prop.id}`}
                onClick={() => setActivePin(prop)}
                className={`group relative transition-all duration-300 flex flex-col items-center cursor-pointer ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-10'
                }`}
              >
                {/* Pin Price Bubble */}
                <div
                  className={`px-3 py-1.5 rounded-2xl text-xs font-black shadow-xl flex items-center gap-1.5 border transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-stone-950 border-white ring-4 ring-emerald-500/30'
                      : 'bg-stone-900 text-white border-stone-700 hover:border-emerald-500'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-stone-950' : 'text-emerald-400'}`} />
                  <span>${prop.minRent}/mo</span>
                </div>

                {/* Pin Tail Point */}
                <div
                  className={`w-2 h-2 rotate-45 -mt-1 ${
                    isSelected ? 'bg-emerald-500' : 'bg-stone-900'
                  }`}
                />

                {/* Pulse ring for active pin */}
                {isSelected && (
                  <div className="absolute -bottom-2 w-8 h-2 bg-emerald-500/50 rounded-full blur-xs animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend Footer */}
        <div className="relative z-10 bg-stone-900/80 backdrop-blur-md p-3 rounded-2xl border border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Immediate Availability
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Open Waitlist
            </span>
          </div>
          <span>Click any marker to preview unit details</span>
        </div>
      </div>

      {/* Selected Property Preview Sidebar */}
      {activePin ? (
        <div className="w-full lg:w-96 bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-800 p-6 flex flex-col justify-between shrink-0">
          <div>
            {/* Image Preview */}
            <div className="relative h-44 rounded-2xl overflow-hidden bg-stone-950 mb-4 border border-stone-800">
              <img
                src={activePin.imageUrl}
                alt={activePin.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                {activePin.waitlistStatus}
              </div>
              <button
                onClick={() => onToggleSave(activePin.id)}
                className="absolute top-3 right-3 p-2 bg-stone-900/80 text-white rounded-full hover:bg-stone-800 transition-colors"
              >
                <Heart className={`w-4 h-4 ${savedPropertyIds.includes(activePin.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Property Info */}
            <h3 className="text-lg font-bold text-white">{activePin.name}</h3>
            <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{activePin.address}, {activePin.city}</span>
            </p>

            <div className="my-4 p-3 bg-stone-800/60 rounded-xl border border-stone-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400">Monthly Rent:</span>
                <span className="font-extrabold text-emerald-400">${activePin.minRent} - ${activePin.maxRent}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Section 8 Vouchers:</span>
                <span className="font-semibold text-stone-200">
                  {activePin.acceptsSection8 ? '100% Accepted' : 'Inquire'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">AMI Tiers:</span>
                <span className="font-bold text-stone-200">{activePin.amiCategories.join(', ')}</span>
              </div>
            </div>

            <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed mb-4">
              {activePin.description}
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-stone-800">
            <button
              id="map-view-details-btn"
              onClick={() => onSelectProperty(activePin)}
              className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              View Full Floor Plans & Amenities
            </button>
            <button
              id="map-apply-now-btn"
              onClick={() => onApplyProperty(activePin)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>{t.applyNow}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-96 bg-stone-900 p-8 flex items-center justify-center text-stone-500 text-xs">
          Select a map location marker to view community options.
        </div>
      )}
    </div>
  );
};
