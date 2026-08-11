import React, { useState } from 'react';
import { SearchCheck, CheckCircle2, Clock, AlertCircle, Building, FileText, Send, Download, Phone, Mail, User } from 'lucide-react';
import { HousingApplication, Language } from '../types';
import { mockProperties } from '../data/mockProperties';
import { translations } from '../data/i18n';

interface ApplicationTrackerProps {
  currentApplication?: HousingApplication | null;
  language: Language;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  currentApplication,
  language,
}) => {
  const t = translations[language];

  const [lookupId, setLookupId] = useState<string>(currentApplication?.id || 'HH-2026-894210');
  const [activeApp, setActiveApp] = useState<HousingApplication | null>(
    currentApplication || {
      id: 'HH-2026-894210',
      submittedAt: new Date().toISOString(),
      status: 'Waitlist Position',
      waitlistPosition: 14,
      targetPropertyIds: ['prop-1'],
      primaryApplicant: {
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.rodriguez@example.com',
        phone: '(510) 555-0198',
        currentAddress: '1240 7th Street',
        city: 'Oakland',
        state: 'CA',
        zipCode: '94607',
        preferredLanguage: 'en',
        isVeteran: false,
        isCurrentlyHomeless: false,
        hasAccessibilityNeeds: true,
      },
      householdMembers: [
        { id: '1', fullName: 'Maria Rodriguez', relationship: 'Self', dateOfBirth: '1988-04-12', isStudent: false, hasDisability: false, ssnOrItin: 'XXX-XX-4810' },
        { id: '2', fullName: 'Mateo Rodriguez', relationship: 'Son', dateOfBirth: '2016-09-24', isStudent: true, hasDisability: false, ssnOrItin: 'XXX-XX-9120' }
      ],
      incomeSources: [
        { id: '1', memberId: '1', memberName: 'Maria Rodriguez', sourceType: 'Employment', employerOrAgency: 'Oakland Health Services', monthlyAmount: 2400 }
      ],
      totalAnnualIncome: 28800,
      calculatedAMI: '30% AMI',
      bedroomsNeeded: 2,
      preferredMoveInDate: 'As soon as available',
      documents: [
        { id: '1', type: 'Photo ID', name: 'Maria_ID.pdf', fileSize: '1.2 MB', uploadedAt: '2026-08-10', status: 'Verified' },
        { id: '2', type: 'Income Proof', name: 'Paystubs_Oct.pdf', fileSize: '2.1 MB', uploadedAt: '2026-08-10', status: 'Verified' }
      ],
      agreedToTerms: true,
      digitalSignature: 'Maria Rodriguez',
      notesFromOfficer: 'Income verified under 30% AMI HUD limits. Positioned #14 on Oak Grove Community Apartments 2-bedroom waitlist.',
    }
  );

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'Housing Officer', text: 'Welcome to HavenHome portal! Your income documentation has been verified.', time: 'Yesterday' }
  ]);

  const handleLookup = () => {
    if (!lookupId.trim()) return;
    // Keep activeApp active or simulate lookup
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setMessages((prev) => [...prev, { sender: 'You', text: messageText, time: 'Just now' }]);
    setMessageText('');
  };

  const targetProp = mockProperties.find((p) => activeApp?.targetPropertyIds.includes(p.id)) || mockProperties[0];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Lookup Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Application Portal Tracker</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{t.navTracker}</h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-1">
            Check live queue status, document reviews, and landlord notifications using your Application ID.
          </p>
        </div>

        {/* Lookup input bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2 max-w-xl">
          <input
            id="tracker-lookup-input"
            type="text"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="Enter Application Reference ID (e.g. HH-2026-894210)..."
            className="w-full px-4 py-3 bg-stone-950 rounded-xl border border-stone-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            id="tracker-lookup-btn"
            onClick={handleLookup}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-sm transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            <SearchCheck className="w-4 h-4" />
            <span>Track</span>
          </button>
        </div>
      </div>

      {activeApp && (
        <div className="space-y-6">
          {/* Status Overview Banner */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <span className="text-xs font-bold text-stone-500 uppercase block">Application Ref #</span>
              <span className="text-xl font-mono font-black text-stone-900">{activeApp.id}</span>
              <span className="text-xs text-stone-500 block mt-0.5">Submitted {new Date(activeApp.submittedAt || '').toLocaleDateString()}</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-800 uppercase block">Current Queue Ranking</span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">
                Waitlist Position #{activeApp.waitlistPosition || 14}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">Verified 30% AMI Tier</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-xs font-bold text-stone-500 uppercase block">Selected Community</span>
              <span className="text-sm font-bold text-stone-900 block mt-1 line-clamp-1">{targetProp.name}</span>
              <span className="text-xs text-stone-500">{targetProp.city}, {targetProp.state}</span>
            </div>
          </div>

          {/* Timeline Progress Bar */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Application Processing Stages</h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1. Application Registered</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2. Income & Papers Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2 shadow-xs">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 animate-spin" />
                <span>3. Active Waitlist Position</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 font-medium flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-stone-400 shrink-0" />
                <span>4. Unit Offer & Lease</span>
              </div>
            </div>
          </div>

          {/* Notes from Housing Officer */}
          {activeApp.notesFromOfficer && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Housing Officer Note:</span>
              </p>
              <p className="text-stone-800 font-medium leading-relaxed">{activeApp.notesFromOfficer}</p>
            </div>
          )}

          {/* Direct Landlord / Officer Messaging */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Direct Messaging with Housing Coordinator</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`p-3 rounded-xl max-w-md ${
                  m.sender === 'You' ? 'bg-emerald-600 text-white ml-auto' : 'bg-white text-stone-900 border border-stone-200'
                }`}>
                  <div className="flex justify-between items-center text-[10px] font-bold opacity-80 mb-1">
                    <span>{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="font-medium">{m.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                id="tracker-msg-input"
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask your housing coordinator a question..."
                className="flex-1 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
              <button
                id="tracker-msg-send-btn"
                onClick={handleSendMessage}
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
