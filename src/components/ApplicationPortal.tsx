import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, User, Users, DollarSign, Building, Upload, ShieldCheck, ArrowRight, ArrowLeft, Trash2, Plus, Sparkles, Check } from 'lucide-react';
import { HousingApplication, Property, HouseholdMember, IncomeSource, ApplicationDocument, Language } from '../types';
import { mockProperties } from '../data/mockProperties';
import { translations } from '../data/i18n';

interface ApplicationPortalProps {
  initialProperty?: Property | null;
  onApplicationSubmitted: (app: HousingApplication) => void;
  language: Language;
}

const STORAGE_KEY = 'havenhome_app_draft';

export const ApplicationPortal: React.FC<ApplicationPortalProps> = ({
  initialProperty,
  onApplicationSubmitted,
  language,
}) => {
  const t = translations[language];

  const [step, setStep] = useState<number>(1);
  const [targetPropertyIds, setTargetPropertyIds] = useState<string[]>(
    initialProperty ? [initialProperty.id] : [mockProperties[0].id]
  );

  // Applicant State
  const [firstName, setFirstName] = useState('Maria');
  const [lastName, setLastName] = useState('Rodriguez');
  const [email, setEmail] = useState('maria.rodriguez@example.com');
  const [phone, setPhone] = useState('(510) 555-0198');
  const [address, setAddress] = useState('1240 7th Street, Apt 2B');
  const [city, setCity] = useState('Oakland');
  const [state, setState] = useState('CA');
  const [zipCode, setZipCode] = useState('94607');
  const [isVeteran, setIsVeteran] = useState(false);
  const [isCurrentlyHomeless, setIsCurrentlyHomeless] = useState(false);
  const [hasAccessibilityNeeds, setHasAccessibilityNeeds] = useState(true);

  // Household Members State
  const [members, setMembers] = useState<HouseholdMember[]>([
    {
      id: 'm1',
      fullName: 'Maria Rodriguez',
      relationship: 'Self (Head of Household)',
      dateOfBirth: '1988-04-12',
      isStudent: false,
      hasDisability: false,
      ssnOrItin: 'XXX-XX-4810',
    },
    {
      id: 'm2',
      fullName: 'Mateo Rodriguez',
      relationship: 'Son',
      dateOfBirth: '2016-09-24',
      isStudent: true,
      hasDisability: false,
      ssnOrItin: 'XXX-XX-9120',
    },
  ]);

  // Income Sources State
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    {
      id: 'i1',
      memberId: 'm1',
      memberName: 'Maria Rodriguez',
      sourceType: 'Employment',
      employerOrAgency: 'Oakland Health Services',
      monthlyAmount: 2400,
    },
    {
      id: 'i2',
      memberId: 'm1',
      memberName: 'Maria Rodriguez',
      sourceType: 'SNAP / TANF',
      employerOrAgency: 'California CalFresh Benefits',
      monthlyAmount: 380,
    },
  ]);

  // Documents State
  const [documents, setDocuments] = useState<ApplicationDocument[]>([
    {
      id: 'd1',
      type: 'Photo ID',
      name: 'Maria_Rodriguez_Drivers_License.pdf',
      fileSize: '1.2 MB',
      uploadedAt: new Date().toLocaleDateString(),
      status: 'Verified',
    },
    {
      id: 'd2',
      type: 'Income Proof',
      name: 'Recent_Paystubs_Oct_Nov_2025.pdf',
      fileSize: '2.4 MB',
      uploadedAt: new Date().toLocaleDateString(),
      status: 'Verified',
    },
  ]);

  // Final agreement & signature
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [digitalSignature, setDigitalSignature] = useState('Maria Rodriguez');

  // Load from draft if present
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.members) setMembers(parsed.members);
        if (parsed.incomeSources) setIncomeSources(parsed.incomeSources);
      } catch (e) {
        console.error('Failed to parse saved draft:', e);
      }
    }
  }, []);

  // Save draft auto-sync
  useEffect(() => {
    const draft = {
      firstName,
      lastName,
      email,
      phone,
      members,
      incomeSources,
      targetPropertyIds,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [firstName, lastName, email, phone, members, incomeSources, targetPropertyIds]);

  // Income calculations
  const totalMonthlyIncome = incomeSources.reduce((acc, curr) => acc + (curr.monthlyAmount || 0), 0);
  const totalAnnualIncome = totalMonthlyIncome * 12;

  // Add Household Member
  const addMember = () => {
    const newId = 'm_' + Date.now();
    setMembers((prev) => [
      ...prev,
      {
        id: newId,
        fullName: '',
        relationship: 'Dependent',
        dateOfBirth: '',
        isStudent: false,
        hasDisability: false,
        ssnOrItin: '',
      },
    ]);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Add Income Source
  const addIncome = () => {
    const newId = 'i_' + Date.now();
    setIncomeSources((prev) => [
      ...prev,
      {
        id: newId,
        memberId: members[0]?.id || 'm1',
        memberName: members[0]?.fullName || 'Applicant',
        sourceType: 'Employment',
        employerOrAgency: '',
        monthlyAmount: 0,
      },
    ]);
  };

  const removeIncome = (id: string) => {
    setIncomeSources((prev) => prev.filter((i) => i.id !== id));
  };

  // Simulate Document Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: ApplicationDocument['type']) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newDoc: ApplicationDocument = {
      id: 'd_' + Date.now(),
      type: docType,
      name: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      uploadedAt: new Date().toLocaleDateString(),
      status: 'Pending Review',
    };

    setDocuments((prev) => [...prev, newDoc]);
  };

  // Submit Application
  const handleSubmit = async () => {
    const refNumber = "HH-" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000);

    const application: HousingApplication = {
      id: refNumber,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
      waitlistPosition: 14,
      targetPropertyIds,
      primaryApplicant: {
        firstName,
        lastName,
        email,
        phone,
        currentAddress: address,
        city,
        state,
        zipCode,
        preferredLanguage: language,
        isVeteran,
        isCurrentlyHomeless,
        hasAccessibilityNeeds,
      },
      householdMembers: members,
      incomeSources,
      totalAnnualIncome,
      calculatedAMI: '50% AMI',
      bedroomsNeeded: members.length > 2 ? 2 : 1,
      preferredMoveInDate: 'As soon as available',
      documents,
      agreedToTerms,
      digitalSignature,
    };

    try {
      await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
    } catch (e) {
      console.warn('Backend endpoint simulated submission fallback active');
    }

    localStorage.removeItem(STORAGE_KEY);
    onApplicationSubmitted(application);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Wizard Header Progress Bar */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">HUD Standard Portal</span>
            <h1 className="text-2xl font-extrabold">{t.appTitle}</h1>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            $0 Fee • Progress Auto-Saved
          </span>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold pt-2 border-t border-stone-800">
          {[
            { num: 1, name: 'Applicant' },
            { num: 2, name: 'Income' },
            { num: 3, name: 'Properties' },
            { num: 4, name: 'Documents' },
            { num: 5, name: 'Submit' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`p-2 rounded-xl transition-all border ${
                step === s.num
                  ? 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-md'
                  : step > s.num
                  ? 'bg-stone-800 text-emerald-400 border-stone-700'
                  : 'bg-stone-950 text-stone-500 border-stone-800'
              }`}
            >
              <div className="text-[10px] uppercase font-mono">Step {s.num}</div>
              <div className="hidden sm:block truncate">{s.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Applicant & Household Info */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-200">
            <User className="w-5 h-5 text-emerald-600" />
            <span>1. Head of Household & Contact Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-stone-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-stone-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-stone-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-stone-700 mb-1">Current Residence Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-stone-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-stone-700 mb-1">Zip Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Priority Preferences Checkboxes */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2 text-xs">
            <h3 className="font-bold text-emerald-950 mb-2">Priority Preference Eligibility:</h3>
            <label className="flex items-center gap-2 text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isVeteran}
                onChange={(e) => setIsVeteran(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>U.S. Military Veteran Household (Qualifies for HUD-VASH priority points)</span>
            </label>
            <label className="flex items-center gap-2 text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrentlyHomeless}
                onChange={(e) => setIsCurrentlyHomeless(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Currently experiencing unhoused or emergency housing instability</span>
            </label>
            <label className="flex items-center gap-2 text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAccessibilityNeeds}
                onChange={(e) => setHasAccessibilityNeeds(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Requires ADA Wheelchair / Ground Floor unit accommodations</span>
            </label>
          </div>

          {/* Household Members List */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Household Members List ({members.length})</span>
              </h3>
              <button
                onClick={addMember}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-3">
              {members.map((m, idx) => (
                <div key={m.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Member #{idx + 1}</span>
                    {idx > 0 && (
                      <button onClick={() => removeMember(m.id)} className="text-rose-600 hover:text-rose-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Full Name</label>
                      <input
                        type="text"
                        value={m.fullName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMembers((prev) => prev.map((item) => (item.id === m.id ? { ...item, fullName: val } : item)));
                        }}
                        placeholder="Full Name"
                        className="w-full p-2.5 bg-white rounded-lg border border-stone-200 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Relationship</label>
                      <input
                        type="text"
                        value={m.relationship}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMembers((prev) => prev.map((item) => (item.id === m.id ? { ...item, relationship: val } : item)));
                        }}
                        placeholder="e.g. Spouse, Son"
                        className="w-full p-2.5 bg-white rounded-lg border border-stone-200 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Date of Birth</label>
                      <input
                        type="date"
                        value={m.dateOfBirth}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMembers((prev) => prev.map((item) => (item.id === m.id ? { ...item, dateOfBirth: val } : item)));
                        }}
                        className="w-full p-2.5 bg-white rounded-lg border border-stone-200 font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forward Action */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <span>Next: Income & Benefits</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Income & Benefits */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-200">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>2. Monthly Household Income & Assistance Benefits</span>
          </h2>

          <div className="p-4 bg-emerald-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-300 font-semibold block">Total Monthly Household Gross</span>
              <span className="text-2xl font-black">${totalMonthlyIncome.toLocaleString()}/mo</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-300 block">Annualized HUD Income</span>
              <span className="text-xl font-bold text-emerald-200">${totalAnnualIncome.toLocaleString()}/yr</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">Reported Income & Support Sources</h3>
              <button
                onClick={addIncome}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source</span>
              </button>
            </div>

            {incomeSources.map((inc) => (
              <div key={inc.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-center">
                <div>
                  <label className="block text-stone-500 font-semibold mb-1">Recipient</label>
                  <span className="font-bold text-stone-800">{inc.memberName}</span>
                </div>
                <div>
                  <label className="block text-stone-500 font-semibold mb-1">Source Type</label>
                  <select
                    value={inc.sourceType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setIncomeSources((prev) => prev.map((item) => (item.id === inc.id ? { ...item, sourceType: val } : item)));
                    }}
                    className="w-full p-2 bg-white rounded-lg border border-stone-200 font-semibold"
                  >
                    <option value="Employment">Job Employment</option>
                    <option value="SSI / SSDI">SSI / SSDI Disability</option>
                    <option value="SNAP / TANF">CalFresh / SNAP / TANF</option>
                    <option value="Child Support">Child Support</option>
                    <option value="Pensions">Pension / Retirement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-500 font-semibold mb-1">Employer / Agency Name</label>
                  <input
                    type="text"
                    value={inc.employerOrAgency}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIncomeSources((prev) => prev.map((item) => (item.id === inc.id ? { ...item, employerOrAgency: val } : item)));
                    }}
                    className="w-full p-2 bg-white rounded-lg border border-stone-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 font-semibold mb-1">Gross Monthly ($)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={inc.monthlyAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setIncomeSources((prev) => prev.map((item) => (item.id === inc.id ? { ...item, monthlyAmount: val } : item)));
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-stone-200 font-bold text-emerald-800"
                    />
                    <button onClick={() => removeIncome(inc.id)} className="text-rose-600 hover:text-rose-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <span>Next: Select Communities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Select Communities */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-200">
            <Building className="w-5 h-5 text-emerald-600" />
            <span>3. Select Target Communities / Open Waitlists</span>
          </h2>

          <p className="text-xs text-stone-600">
            Select one or more housing communities to receive your application simultaneously.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProperties.map((prop) => {
              const isSelected = targetPropertyIds.includes(prop.id);
              return (
                <div
                  key={prop.id}
                  onClick={() => {
                    setTargetPropertyIds((prev) =>
                      isSelected ? prev.filter((id) => id !== prop.id) : [...prev, prop.id]
                    );
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 text-sm truncate">{prop.name}</h4>
                    <p className="text-xs text-stone-500">{prop.city}, {prop.state} ({prop.waitlistStatus})</p>
                    <p className="text-xs font-black text-emerald-800 mt-1">${prop.minRent} - ${prop.maxRent}/mo</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={targetPropertyIds.length === 0}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <span>Next: Document Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Document Vault */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-200">
            <Upload className="w-5 h-5 text-emerald-600" />
            <span>4. Document Vault & Verification Papers</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { type: 'Photo ID' as const, label: "Government Photo ID (Driver's License / Passport)" },
              { type: 'Income Proof' as const, label: '3 Recent Consecutive Paystubs or W-2' },
              { type: 'Tax Return' as const, label: 'Most Recent 2024 / 2025 Tax Return' },
              { type: 'Benefit Letter' as const, label: 'SNAP / SSI / SSDI Benefit Statement' },
            ].map((item) => (
              <div key={item.type} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-800 block">{item.label}</span>
                <label className="cursor-pointer block text-center p-3 bg-white hover:bg-emerald-50 rounded-xl border border-dashed border-stone-300 text-xs font-semibold text-emerald-700 transition-colors">
                  <Upload className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, item.type)}
                    className="hidden"
                  />
                </label>
              </div>
            ))}
          </div>

          {/* Uploaded Files Table */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <h3 className="font-bold text-stone-900 text-sm">Uploaded Documents ({documents.length})</h3>
            {documents.map((doc) => (
              <div key={doc.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-900">{doc.name}</p>
                  <p className="text-[10px] text-stone-500">{doc.type} • {doc.fileSize} • Uploaded {doc.uploadedAt}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <span>Next: Declaration & Sign</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Declaration, Digital Signature & Submit */}
      {step === 5 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>5. Fair Housing Declaration & E-Signature</span>
          </h2>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-2">
            <p className="font-bold text-stone-900">HUD Fair Housing Disclosure & Accuracy Acknowledgement:</p>
            <p>
              Under Title VIII of the Civil Rights Act of 1968 (Fair Housing Act), it is illegal to discriminate against any person because of race, color, religion, sex, handicap, familial status, or national origin.
            </p>
            <p>
              I certify that all income, household, and personal statements supplied in this application are true and correct to the best of my knowledge.
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs font-semibold text-stone-900">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>I declare under penalty of perjury that the information supplied above is accurate.</span>
          </label>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Type Full Legal Name (Electronic Signature)
            </label>
            <input
              type="text"
              value={digitalSignature}
              onChange={(e) => setDigitalSignature(e.target.value)}
              placeholder="e.g. Maria Rodriguez"
              className="w-full p-3.5 bg-stone-50 rounded-xl border border-stone-200 font-bold text-stone-900 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              id="submit-housing-application-btn"
              onClick={handleSubmit}
              disabled={!agreedToTerms || !digitalSignature.trim()}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 text-white font-extrabold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Submit Housing Application ($0 Fee)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
