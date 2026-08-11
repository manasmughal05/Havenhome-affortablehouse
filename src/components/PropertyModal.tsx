import React, { useState } from 'react';
import { X, MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle2, FileText, ArrowRight, Building, Bus, GraduationCap, ShoppingBag, Accessibility, Sparkles, Heart } from 'lucide-react';
import { Property, Language } from '../types';
import { translations } from '../data/i18n';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
  onApply: (prop: Property) => void;
  isSaved: boolean;
  onToggleSave: (propId: string) => void;
  language: Language;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  onClose,
  onApply,
  isSaved,
  onToggleSave,
  language,
}) => {
  if (!property) return null;
  const t = translations[language];

  const [selectedImg, setSelectedImg] = useState<string>(property.imageUrl);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        id="property-modal-content"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative my-auto"
      >
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Low-Income Community Listing</span>
            <h2 className="text-xl font-extrabold text-stone-900 leading-tight">{property.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="modal-save-btn"
              onClick={() => onToggleSave(property.id)}
              className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Main Gallery */}
          <div className="space-y-3">
            <div className="h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-stone-100 relative">
              <img
                src={selectedImg}
                alt={property.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-emerald-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30">
                {property.waitlistStatus}
              </div>
            </div>

            {/* Thumbnails */}
            {property.gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {property.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(imgUrl)}
                    className={`h-20 w-28 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImg === imgUrl ? 'border-emerald-600 scale-95 shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-xs font-semibold text-stone-500 block">Monthly Rent Range</span>
              <p className="text-2xl font-black text-emerald-800">${property.minRent} - ${property.maxRent}</p>
              <p className="text-xs text-stone-500 mt-1">Capped according to HUD AMI limits</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-xs font-semibold text-stone-500 block">HUD Income Standards</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {property.amiCategories.map((ami) => (
                  <span key={ami} className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                    {ami}
                  </span>
                ))}
              </div>
              <p className="text-xs text-stone-500 mt-1">Area Median Income Eligibility</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-xs font-semibold text-stone-500 block">Section 8 Vouchers</span>
              <p className="text-sm font-bold text-stone-900 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {property.acceptsSection8 ? '100% Accepted' : 'Inquire with management'}
              </p>
              <p className="text-xs text-stone-500 mt-1">Housing Choice Vouchers welcome</p>
            </div>
          </div>

          {/* Location & Description */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">About This Affordable Community</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{property.description}</p>
            <p className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 mt-3">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{property.address}, {property.city}, {property.state} {property.zipCode} ({property.neighborhood})</span>
            </p>
          </div>

          {/* Unit Pricing & Availability Table */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              <span>Available Floor Plans & Rents</span>
            </h3>
            <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                    <th className="p-3">Unit Type</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Monthly Rent</th>
                    <th className="p-3">Deposit</th>
                    <th className="p-3">HUD AMI Tier</th>
                    <th className="p-3 text-right">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                  {property.units.map((u, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="p-3 font-bold">{u.type}</td>
                      <td className="p-3 text-stone-500">{u.squareFeet} sq ft</td>
                      <td className="p-3 font-black text-emerald-700">${u.rentMonthly}/mo</td>
                      <td className="p-3 text-stone-600">${u.deposit}</td>
                      <td className="p-3">
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          {u.amiLimit}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {u.availableCount} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Amenities & Accessibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Community Amenities</span>
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-xs font-medium text-stone-700">
                {property.amenities.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 bg-stone-50 p-2 rounded-lg border border-stone-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <Accessibility className="w-4 h-4 text-emerald-600" />
                <span>Accessibility & Features</span>
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-xs font-medium text-stone-700">
                {property.accessibilityFeatures.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 bg-stone-50 p-2 rounded-lg border border-stone-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Neighborhood & Proximity Scores */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 space-y-3">
            <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <Bus className="w-4 h-4 text-emerald-700" />
              <span>Neighborhood & Transit Proximity</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center">
                <span className="text-stone-500 font-medium block">Walk Score</span>
                <span className="text-xl font-black text-emerald-800">{property.walkScore} / 100</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center">
                <span className="text-stone-500 font-medium block">Transit Score</span>
                <span className="text-xl font-black text-emerald-800">{property.transitScore} / 100</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-left col-span-2">
                <span className="text-stone-500 font-medium block flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Nearby Schools
                </span>
                <p className="font-bold text-stone-800 mt-1">{property.nearbySchools.join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Required Application Documents */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50">
            <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Required Paperwork Checklist for Applying</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 font-medium">
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Government Photo ID (Adults 18+)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>3 Recent Paystubs or W-2 / Tax Return</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Social Security Cards or ITINs</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Benefit Award Letter (SNAP / SSI if applicable)</span>
              </div>
            </div>
          </div>

          {/* Contact & Management Box */}
          <div className="bg-stone-900 text-white rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Property Management</span>
              <h4 className="text-lg font-bold">{property.managementCompany}</h4>
              <p className="text-xs text-stone-300 mt-1 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {property.contactPhone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {property.contactEmail}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-400" /> {property.officeHours}</span>
              </p>
              {property.hudProjectNumber && (
                <p className="text-[11px] text-stone-400 mt-1">HUD Project #: {property.hudProjectNumber}</p>
              )}
            </div>

            <button
              id="modal-apply-now-btn"
              onClick={() => {
                onClose();
                onApply(property);
              }}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm shrink-0"
            >
              <span>{t.applyNow}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
