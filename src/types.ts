export type RaceClass = '1/8 Nitro Buggy' | '1/8 E-Buggy' | '1/8 Truggy';

export type EventSeries = 
  | 'Summer Series' 
  | 'Winter Series' 
  | 'Club Championship' 
  | 'Open Practice & Track Day' 
  | 'Special Trophy Meeting';

export interface RaceEvent {
  id: string;
  title: string;
  series: EventSeries;
  roundNumber?: number;
  date: string; // YYYY-MM-DD
  gatesOpen: string;
  bookingCloses: string;
  driversBriefing: string;
  racingStarts: string;
  location: string;
  classes: RaceClass[];
  standardFee: number;
  memberFee: number;
  maxEntries: number;
  status: 'open' | 'closed' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  cashAccepted: boolean;
  onlineAccepted: boolean;
  entryCount?: number;
}

export interface EventEntry {
  id: string;
  eventId: string;
  driverName: string;
  email: string;
  phone: string;
  brcaNumber: string;
  transponderNumber: string;
  carClass: RaceClass;
  isMember: boolean;
  membershipNumber?: string;
  feeCharged: number;
  paymentMethod: 'cash' | 'online';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  notes?: string;
}

export type MembershipTier = 'Adult' | 'Junior (Under 16)' | 'Senior';

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  brcaNumber: string;
  primaryClass: RaceClass;
  membershipType: MembershipTier;
  membershipNumber: string | null; // e.g. "NWN-042" - manually assigned by admin
  status: 'pending' | 'active' | 'expired';
  joinedDate: string;
  expiryDate: string;
  notes?: string;
}

export interface FinalResultDriver {
  position: number;
  startNumber: number;
  driverName: string;
  carNumber: number;
  laps: number;
  time: string;
  bestLap: string;
  averageLap?: string;
  bumpUp?: boolean;
}

export interface FinalGroup {
  finalName: string; // "A Final", "B Final", etc.
  duration: string;
  results: FinalResultDriver[];
}

export interface ClassResult {
  className: RaceClass;
  finals: FinalGroup[];
}

export interface RCMeetingResult {
  id: string;
  rcResultsMeetingId?: string;
  venueId: number; // 34 for North West Nitro
  meetingName: string;
  date: string;
  venueName: string;
  externalUrl?: string;
  classes: ClassResult[];
  summary: {
    totalDrivers: number;
    nitroBuggyWinner?: string;
    eBuggyWinner?: string;
    truggyWinner?: string;
  };
}

export interface ClubSettings {
  clubName: string;
  trackAddress: string;
  postcode: string;
  brcaAffiliationNumber: string;
  venueId: number; // 34
  cashPaymentsEnabled: boolean;
  onlinePaymentsEnabled: boolean;
  paymentNotice: string;
  defaultStandardFee: number;
  defaultMemberFee: number;
  annualSeniorFee: number;
  annualJuniorFee: number;
}
