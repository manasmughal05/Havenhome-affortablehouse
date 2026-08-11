import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertCircle, Building2, ArrowRight, ShieldCheck, DollarSign, Users, Sparkles, HelpCircle } from 'lucide-react';
import { AMICategory, Property, Language } from '../types';
import { mockProperties } from '../data/mockProperties';
import { translations } from '../data/i18n';

interface EligibilityCalculatorProps {
  onSelectProperty: (prop: Property) => void;
  onApplyProperty: (prop: Property) => void;
  language: Language;
}

// HUD Income Limits Matrix by Metro Area & Household Size
const HUD_LIMITS: Record<string, Record<number, { ami30: number; ami50: number; ami60: number; ami80: number }>> = {
  "SF Bay Area": {
    1: { ami30: 32500, ami50: 54200, ami60: 65000, ami80: 86700 },
    2: { ami30: 37150, ami50: 61950, ami60: 74300, ami80: 99100 },
    3: { ami30: 41800, ami50: 69700, ami60: 83600, ami80: 111500 },
    4: { ami30: 46400, ami50: 77400, ami60: 92900, ami80: 123800 },
    5: { ami30: 50150, ami50: 83600, ami60: 100300, ami80: 133800 },
    6: { ami30: 53850, ami50: 89800, ami60: 107800, ami80: 143700 }
  },
  "Los Angeles Metro": {
    1: { ami30: 26500, ami50: 44150, ami60: 53000, ami80: 70650 },
    2: { ami30: 30300, ami50: 50450, ami60: 60500, ami80: 80750 },
    3: { ami30: 34100, ami50: 56750, ami60: 68100, ami80: 90850 },
    4: { ami30: 37850, ami50: 63050, ami60: 75600, ami80: 100900 },
    5: { ami30: 40900, ami50: 68100, ami60: 81700, ami80: 109000 },
    6: { ami30: 43950, ami50: 73150, ami60: 87750, ami80: 117050 }
  },
  "Chicago Metro": {
    1: { ami30: 23200, ami50: 38650, ami60: 46380, ami80: 61850 },
    2: { ami30: 26500, ami50: 44200, ami60: 53040, ami80: 70700 },
    3: { ami30: 29800, ami50: 49700, ami60: 59640, ami80: 79550 },
    4: { ami30: 33100, ami50: 55200, ami60: 66240, ami80: 88350 },
    5: { ami30: 35750, ami50: 59650, ami60: 71580, ami80: 95450 },
    6: { ami30: 38400, ami50: 64050, ami60: 76860, ami80: 102500 }
  },
  "Austin Metro": {
    1: { ami30: 24300, ami50: 40500, ami60: 48600, ami80: 64800 },
    2: { ami30: 27800, ami50: 46300, ami60: 55560, ami80: 74050 },
    3: { ami30: 31250, ami50: 52100, ami60: 62520, ami80: 83300 },
    4: { ami30: 34700, ami50: 57850, ami60: 69420, ami80: 92550 },
    5: { ami30: 37500, ami50: 62500, ami60: 75000, ami80: 100000 },
    6: { ami30: 40300, ami50: 67150, ami60: 80600, ami80: 107400 }
  }
};

export const EligibilityCalculator: React.FC<EligibilityCalculatorProps> = ({
  onSelectProperty,
  onApplyProperty,
  language,
}) => {
  const t = translations[language];

  const [householdSize, setHouseholdSize] = useState<number>(3);
  const [region, setRegion] = useState<string>("SF Bay Area");
  const [annualIncome, setAnnualIncome] = useState<number>(36000);
  const [hasVoucher, setHasVoucher] = useState<boolean>(true);
  const [isCalculated, setIsCalculated] = useState<boolean>(true);

  // Calculate HUD Tier
  const limits = HUD_LIMITS[region]?.[Math.min(householdSize, 6)] || HUD_LIMITS["SF Bay Area"][3];

  let amiCategory: AMICategory = "80% AMI";
  let tierLabel = "Low Income (80% AMI)";
  let tierColor = "bg-sky-100 text-sky-800 border-sky-300";

  if (annualIncome <= limits.ami30) {
    amiCategory = "30% AMI";
    tierLabel = "Extremely Low Income (30% AMI)";
    tierColor = "bg-emerald-100 text-emerald-900 border-emerald-300";
  } else if (annualIncome <= limits.ami50) {
    amiCategory = "50% AMI";
    tierLabel = "Very Low Income (50% AMI)";
    tierColor = "bg-teal-100 text-teal-900 border-teal-300";
  } else if (annualIncome <= limits.ami60) {
    amiCategory = "60% AMI";
    tierLabel = "Workforce Affordable (60% AMI)";
    tierColor = "bg-amber-100 text-amber-900 border-amber-300";
  } else if (annualIncome <= limits.ami80) {
    amiCategory = "80% AMI";
    tierLabel = "Low Income (80% AMI)";
    tierColor = "bg-sky-100 text-sky-900 border-sky-300";
  } else {
    tierLabel = "Over 80% AMI (May exceed standard low-income cap)";
    tierColor = "bg-stone-100 text-stone-800 border-stone-300";
  }

  // Max recommended rent (30% of gross monthly income rule)
  const grossMonthlyIncome = Math.round(annualIncome / 12);
  const maxAffordableRent = Math.round(grossMonthlyIncome * 0.3);

  // Filter matching properties
  const matchingProperties = mockProperties.filter((p) => {
    return p.amiCategories.includes(amiCategory) || p.acceptsSection8 && hasVoucher;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      {/* Title Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HUD Standard Income Check</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{t.calculatorTitle}</h1>
          <p className="text-stone-300 text-sm mt-2 max-w-2xl leading-relaxed">
            {t.calculatorSubtitle} Enter your household details to see your exact HUD eligibility category and maximum affordable monthly rent limit.
          </p>
        </div>
      </div>

      {/* Input Form & Instant Output Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calculator Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-200">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span>1. Enter Household Income Details</span>
          </h2>

          {/* Region Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Select Metro Region / County
            </label>
            <select
              id="calc-region-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="SF Bay Area">San Francisco Bay Area / Oakland, CA</option>
              <option value="Los Angeles Metro">Los Angeles Metro / Orange County, CA</option>
              <option value="Chicago Metro">Chicago Metro / Cook County, IL</option>
              <option value="Austin Metro">Austin Metro / Travis County, TX</option>
            </select>
          </div>

          {/* Household Size */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{t.calcHouseholdSize}</span>
              </label>
              <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {householdSize} {householdSize === 1 ? 'person' : 'people'}
              </span>
            </div>
            <input
              id="calc-household-slider"
              type="range"
              min={1}
              max={6}
              value={householdSize}
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-medium">
              <span>1 Person</span>
              <span>3 People</span>
              <span>6+ People</span>
            </div>
          </div>

          {/* Annual Household Income */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Total Annual Gross Household Income</span>
              </label>
              <span className="text-base font-black text-emerald-800">${annualIncome.toLocaleString()}/yr</span>
            </div>
            <input
              id="calc-income-slider"
              type="range"
              min={10000}
              max={120000}
              step={1000}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-medium">
              <span>$10,000/yr</span>
              <span>$60,000/yr</span>
              <span>$120,000/yr</span>
            </div>
          </div>

          {/* Section 8 Voucher Checkbox */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="text-xs font-bold text-stone-900">Do you have a Section 8 Housing Choice Voucher?</p>
                <p className="text-[11px] text-stone-600">Vouchers guarantee HUD rental assistance regardless of AMI cap.</p>
              </div>
            </div>
            <input
              id="calc-has-voucher-toggle"
              type="checkbox"
              checked={hasVoucher}
              onChange={(e) => setHasVoucher(e.target.checked)}
              className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Results Card (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900 text-white rounded-3xl border border-stone-800 p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 pb-3 border-b border-stone-800 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span>2. Your Calculated HUD Tier</span>
          </h2>

          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border font-bold text-center ${tierColor}`}>
              <span className="text-xs font-semibold uppercase tracking-wider block opacity-80">HUD AMI Status</span>
              <span className="text-xl font-black block mt-1">{tierLabel}</span>
            </div>

            <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Gross Monthly Income:</span>
                <span className="font-extrabold text-white text-sm">${grossMonthlyIncome.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-700">
                <span className="text-stone-400">30% HUD Max Rent Cap:</span>
                <span className="font-extrabold text-emerald-400 text-sm">${maxAffordableRent.toLocaleString()}/mo</span>
              </div>
            </div>

            {/* Threshold limits comparison */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-[11px] space-y-1.5 text-stone-300">
              <p className="font-bold text-stone-200 mb-1">HUD Income Limits for {householdSize} Household in {region}:</p>
              <div className="flex justify-between">
                <span>30% AMI Limit:</span>
                <span className="font-bold text-emerald-400">${limits.ami30.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>50% AMI Limit:</span>
                <span className="font-bold text-teal-400">${limits.ami50.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>80% AMI Limit:</span>
                <span className="font-bold text-sky-400">${limits.ami80.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Eligible Communities */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Matching Affordable Communities ({matchingProperties.length})</span>
            </h3>
            <p className="text-xs text-stone-500">
              These communities match your calculated {amiCategory} HUD threshold.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchingProperties.map((prop) => (
            <div key={prop.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between hover:border-emerald-500 transition-colors">
              <div>
                <img src={prop.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-32 object-cover rounded-xl mb-3" />
                <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{prop.name}</h4>
                <p className="text-xs text-stone-500">{prop.city}, {prop.state}</p>
                <p className="text-xs font-black text-emerald-800 mt-2">${prop.minRent} - ${prop.maxRent}/mo</p>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-stone-200">
                <button
                  onClick={() => onSelectProperty(prop)}
                  className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs"
                >
                  Details
                </button>
                <button
                  onClick={() => onApplyProperty(prop)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
