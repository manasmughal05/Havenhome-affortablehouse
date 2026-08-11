import React from 'react';
import { LifeBuoy, ShieldCheck, FileText, PhoneCall, ExternalLink, HelpCircle, HeartHandshake, Scale, AlertTriangle, Building2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/i18n';

interface ResourceHubProps {
  language: Language;
}

export const ResourceHub: React.FC<ResourceHubProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Tenant Rights & Support Services</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{t.navResources}</h1>
        <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Free assistance, legal aid resources, Section 8 voucher guidelines, and local emergency support for low-income families.
        </p>
      </div>

      {/* Grid of Key Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 8 Guide Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3 hover:border-emerald-500 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">Section 8 Housing Choice Voucher Guide</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Learn how Housing Choice Vouchers work, how tenant portions are calculated (typically 30% of adjusted gross income), and how to protect your voucher rights when applying to private properties.
          </p>
          <ul className="text-xs text-stone-700 space-y-1 font-semibold pt-2 border-t border-stone-100">
            <li className="flex items-center gap-2">✓ Source of Income Non-Discrimination Protections</li>
            <li className="flex items-center gap-2">✓ Voucher Transfer & Portability across cities</li>
            <li className="flex items-center gap-2">✓ Utility allowance deductions</li>
          </ul>
        </div>

        {/* Fair Housing Rights */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3 hover:border-emerald-500 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">HUD Fair Housing Act Protections</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            It is illegal for housing providers or landlords to discriminate against you based on race, color, national origin, religion, sex, familial status, or disability.
          </p>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800">
            <span>To report housing discrimination, call HUD Fair Housing Hotline at 1-800-669-9777.</span>
          </div>
        </div>

        {/* Emergency Rental & Utility Assistance */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3 hover:border-emerald-500 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">Emergency Rental & Utility Assistance</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Facing back-rent or utility shutoff notices? Government LIHEAP and ERA emergency relief programs can cover up to 12 months of past-due rent and power bills directly.
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-950 flex items-center justify-between">
            <span>Call 2-1-1 for local ERAP grants</span>
            <PhoneCall className="w-4 h-4 text-amber-700" />
          </div>
        </div>

        {/* Free Legal Aid & Eviction Prevention */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3 hover:border-emerald-500 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">Free Legal Aid & Eviction Prevention</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Get free legal representation for tenant rights, eviction defense, lease dispute resolution, and security deposit returns for low-income households.
          </p>
          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs font-bold text-sky-950">
            <span>Visit LawHelp.org to find free legal clinics in your county.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
