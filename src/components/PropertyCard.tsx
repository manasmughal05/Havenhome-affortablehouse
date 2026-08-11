import React from 'react';
import { MapPin, Heart, ShieldCheck, Check, Clock, ArrowRight, Accessibility, PawPrint, Building } from 'lucide-react';
import { Property, Language } from '../types';
import { translations } from '../data/i18n';

interface PropertyCardProps {
  property: Property;
  onSelect: (prop: Property) => void;
  onApply: (prop: Property) => void;
  isSaved: boolean;
  onToggleSave: (propId: string) => void;
  language: Language;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onApply,
  isSaved,
  onToggleSave,
  language,
}) => {
  const t = translations[language];

  // Waitlist color coding
  const getWaitlistBadge = (status: string) => {
    switch (status) {
      case 'Immediate Availability':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Open Waitlist':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Lottery Open':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div
      id={`property-card-${property.id}`}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group relative"
    >
      {/* Property Image Header */}
      <div className="relative h-52 w-full overflow-hidden bg-stone-100">
        <img
          src={property.imageUrl}
          alt={property.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Waitlist Badge */}
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs ${getWaitlistBadge(property.waitlistStatus)}`}>
            {property.waitlistStatus}
          </span>

          {/* Save / Bookmark Button */}
          <button
            id={`save-btn-${property.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            className="p-2 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-600 hover:bg-white shadow-md transition-all cursor-pointer"
            title={isSaved ? "Remove from saved" : "Save property"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Bottom Floating Info: Rent & AMI Tiers */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <span className="text-xs font-semibold text-stone-200 block">Monthly Rent</span>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              ${property.minRent} - ${property.maxRent}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 justify-end">
            {property.amiCategories.map((ami) => (
              <span key={ami} className="bg-emerald-900/80 backdrop-blur-sm text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                {ami}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Property Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Address */}
          <div className="mb-3">
            <h3
              onClick={() => onSelect(property)}
              className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
            >
              {property.name}
            </h3>
            <p className="text-xs font-medium text-stone-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{property.address}, {property.city}, {property.state} ({property.neighborhood})</span>
            </p>
          </div>

          {/* Section 8 & Accessibility Highlights */}
          <div className="flex flex-wrap gap-1.5 mb-4 text-[11px] font-semibold">
            {property.acceptsSection8 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Section 8 Accepted
              </span>
            )}
            {property.accessibilityFeatures.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                <Accessibility className="w-3 h-3 text-stone-600" />
                ADA Accessible
              </span>
            )}
            {property.petFriendly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                <PawPrint className="w-3 h-3 text-stone-600" />
                Pet Friendly
              </span>
            )}
          </div>

          {/* Available Units Summary */}
          <div className="bg-stone-50 rounded-xl p-3 mb-4 border border-stone-100">
            <div className="text-xs font-bold text-stone-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                Unit Options
              </span>
              <span className="text-[10px] text-stone-500 font-normal">HUD Capped Rates</span>
            </div>
            <div className="space-y-1">
              {property.units.map((unit, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-stone-600">
                  <span className="font-medium">{unit.type} ({unit.squareFeet} sq ft)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">${unit.rentMonthly}/mo</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 rounded">
                      {unit.availableCount} available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <button
            id={`details-btn-${property.id}`}
            onClick={() => onSelect(property)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors text-center"
          >
            {t.viewDetails}
          </button>

          <button
            id={`apply-btn-${property.id}`}
            onClick={() => onApply(property)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-xs"
          >
            <span>{t.applyNow}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
