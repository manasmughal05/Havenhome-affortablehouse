export type AMICategory = '30% AMI' | '50% AMI' | '60% AMI' | '80% AMI';

export type WaitlistStatus = 'Open Waitlist' | 'Immediate Availability' | 'Lottery Open' | 'Waitlist Closed';

export interface PropertyUnit {
  type: string; // e.g. '1 Bedroom', '2 Bedrooms', 'Studio'
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  rentMonthly: number;
  deposit: number;
  amiLimit: AMICategory;
  availableCount: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  gallery: string[];
  description: string;
  minRent: number;
  maxRent: number;
  amiCategories: AMICategory[];
  waitlistStatus: WaitlistStatus;
  waitlistEstimatedMonths?: number;
  units: PropertyUnit[];
  acceptsSection8: boolean;
  utilitiesIncluded: string[];
  amenities: string[];
  accessibilityFeatures: string[];
  petFriendly: boolean;
  builtYear: number;
  contactPhone: string;
  contactEmail: string;
  officeHours: string;
  hudProjectNumber?: string;
  walkScore: number;
  transitScore: number;
  nearbySchools: string[];
  nearbyGrocery: string[];
  managementCompany: string;
}

export interface HouseholdMember {
  id: string;
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  isStudent: boolean;
  hasDisability: boolean;
  ssnOrItin: string;
}

export interface IncomeSource {
  id: string;
  memberId: string;
  memberName: string;
  sourceType: 'Employment' | 'SSI / SSDI' | 'SNAP / TANF' | 'Child Support' | 'Pensions' | 'Self-Employment' | 'Other';
  employerOrAgency: string;
  monthlyAmount: number;
}

export interface ApplicationDocument {
  id: string;
  type: 'Photo ID' | 'Income Proof' | 'Tax Return' | 'Bank Statement' | 'Benefit Letter' | 'Other';
  name: string;
  fileSize: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending Review' | 'Needs Attention';
}

export interface HousingApplication {
  id: string;
  submittedAt?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Income Verified' | 'Waitlist Position' | 'Approved' | 'Action Needed';
  waitlistPosition?: number;
  targetPropertyIds: string[];
  primaryApplicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    currentAddress: string;
    city: string;
    state: string;
    zipCode: string;
    preferredLanguage: string;
    isVeteran: boolean;
    isCurrentlyHomeless: boolean;
    hasAccessibilityNeeds: boolean;
  };
  householdMembers: HouseholdMember[];
  incomeSources: IncomeSource[];
  totalAnnualIncome: number;
  calculatedAMI: AMICategory;
  bedroomsNeeded: number;
  preferredMoveInDate: string;
  documents: ApplicationDocument[];
  agreedToTerms: boolean;
  digitalSignature: string;
  notesFromOfficer?: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  maxRent: number;
  bedrooms: string; // 'all' | '0' | '1' | '2' | '3+'
  amiCategory: string; // 'all' | '30%' | '50%' | '60%' | '80%'
  waitlistStatus: string; // 'all' | 'open' | 'immediate'
  section8Only: boolean;
  wheelchairOnly: boolean;
  petsOnly: boolean;
  utilitiesIncludedOnly: boolean;
  sortBy: 'rent-low' | 'rent-high' | 'walk-score' | 'newest';
}

export type Language = 'en' | 'es' | 'vi' | 'zh';
