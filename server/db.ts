import fs from 'fs';
import path from 'path';
import { RaceEvent, EventEntry, Member, RCMeetingResult, ClubSettings } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  events: RaceEvent[];
  entries: EventEntry[];
  members: Member[];
  results: RCMeetingResult[];
  settings: ClubSettings;
}

const initialSettings: ClubSettings = {
  clubName: 'North West Nitro RC Club',
  trackAddress: 'Mythop Road, Blackpool, Lancashire',
  postcode: 'FY4 4XN',
  brcaAffiliationNumber: 'BRCA-NWN-034',
  venueId: 34,
  cashPaymentsEnabled: true,
  onlinePaymentsEnabled: false, // Ready to toggle when merchant gateway is live
  paymentNotice: 'Cash payments are accepted on the morning of racing at race control before 08:30. Online card payments will be enabled once our Stripe gateway connects.',
  defaultStandardFee: 15,
  defaultMemberFee: 10,
  annualSeniorFee: 35,
  annualJuniorFee: 25,
};

const initialEvents: RaceEvent[] = [
  {
    id: 'evt-summer-rd4',
    title: 'Summer Series 2026 - Round 4',
    series: 'Summer Series',
    roundNumber: 4,
    date: '2026-06-14',
    gatesOpen: '07:30',
    bookingCloses: '08:30',
    driversBriefing: '08:45',
    racingStarts: '09:00',
    location: 'North West Nitro Track, Mythop Rd, Blackpool FY4 4XN',
    classes: ['1/8 Nitro Buggy', '1/8 E-Buggy', '1/8 Truggy'],
    standardFee: 15,
    memberFee: 10,
    maxEntries: 90,
    status: 'open',
    description: 'Round 4 of our premier Summer Championship. Off Road Circuit & multi-surface technical layout with elevated crossover jump, high-speed sweeper, and driver rostrum with covered pit bays. 3 rounds of qualifying followed by bump-up finals for all drivers.',
    cashAccepted: true,
    onlineAccepted: false,
  },
  {
    id: 'evt-summer-rd5',
    title: 'Summer Series 2026 - Round 5',
    series: 'Summer Series',
    roundNumber: 5,
    date: '2026-07-12',
    gatesOpen: '07:30',
    bookingCloses: '08:30',
    driversBriefing: '08:45',
    racingStarts: '09:00',
    location: 'North West Nitro Track, Mythop Rd, Blackpool FY4 4XN',
    classes: ['1/8 Nitro Buggy', '1/8 E-Buggy', '1/8 Truggy'],
    standardFee: 15,
    memberFee: 10,
    maxEntries: 90,
    status: 'open',
    description: 'Round 5 championship battle! Catering van on site serving hot breakfasts, drinks and burgers all day. Transponders available for hire if required (£5).',
    cashAccepted: true,
    onlineAccepted: false,
  },
  {
    id: 'evt-summer-rd6',
    title: 'Summer Series 2026 - Grand Finale (Round 6)',
    series: 'Summer Series',
    roundNumber: 6,
    date: '2026-08-16',
    gatesOpen: '07:30',
    bookingCloses: '08:30',
    driversBriefing: '08:45',
    racingStarts: '09:00',
    location: 'North West Nitro Track, Mythop Rd, Blackpool FY4 4XN',
    classes: ['1/8 Nitro Buggy', '1/8 E-Buggy', '1/8 Truggy'],
    standardFee: 15,
    memberFee: 10,
    maxEntries: 100,
    status: 'open',
    description: 'The crowning event of the 2026 Summer Series! Annual championship trophy presentations at the end of the day, plus special raffles and driver BBQ.',
    cashAccepted: true,
    onlineAccepted: false,
  },
  {
    id: 'evt-open-practice-1',
    title: 'Track Open Practice & Test Day',
    series: 'Open Practice & Track Day',
    date: '2026-05-30',
    gatesOpen: '09:00',
    bookingCloses: '11:00',
    driversBriefing: '09:30',
    racingStarts: '10:00',
    location: 'North West Nitro Track, Mythop Rd, Blackpool FY4 4XN',
    classes: ['1/8 Nitro Buggy', '1/8 E-Buggy'],
    standardFee: 10,
    memberFee: 5,
    maxEntries: 60,
    status: 'open',
    description: 'Open track practice day to test setups, tyre compounds, and engine tuning on our newly groomed jump faces and berms. AMB lap timing loop will be active.',
    cashAccepted: true,
    onlineAccepted: false,
  },
  {
    id: 'evt-winter-rd1',
    title: 'Winter Warm-Up Trophy Meeting 2026',
    series: 'Winter Series',
    roundNumber: 1,
    date: '2026-10-18',
    gatesOpen: '08:00',
    bookingCloses: '09:00',
    driversBriefing: '09:15',
    racingStarts: '09:30',
    location: 'North West Nitro Track, Mythop Rd, Blackpool FY4 4XN',
    classes: ['1/8 Nitro Buggy', '1/8 E-Buggy'],
    standardFee: 15,
    memberFee: 10,
    maxEntries: 80,
    status: 'open',
    description: 'Opening round of our renowned winter challenge. High-grip Off Road Circuit ensures fast, reliable racing whatever the Lancashire weather throws at us.',
    cashAccepted: true,
    onlineAccepted: false,
  }
];

const initialMembers: Member[] = [
  {
    id: 'mem-1',
    fullName: 'Mark Jenkins',
    email: 'mark.jenkins@nwnitro-racing.co.uk',
    phone: '07700 900142',
    address: '14 Stanley Road',
    postcode: 'FY3 8LP',
    emergencyContactName: 'Sarah Jenkins',
    emergencyContactPhone: '07700 900143',
    brcaNumber: 'BRCA-41092',
    primaryClass: '1/8 Nitro Buggy',
    membershipType: 'Adult',
    membershipNumber: 'NWN-001',
    status: 'active',
    joinedDate: '2025-01-10',
    expiryDate: '2026-12-31',
    notes: 'Committee member & timing official',
  },
  {
    id: 'mem-2',
    fullName: 'David Bradley',
    email: 'dbradley.rc@gmail.com',
    phone: '07700 900582',
    address: '88 Preston New Road',
    postcode: 'PR4 1AA',
    emergencyContactName: 'Emma Bradley',
    emergencyContactPhone: '07700 900583',
    brcaNumber: 'BRCA-38491',
    primaryClass: '1/8 E-Buggy',
    membershipType: 'Adult',
    membershipNumber: 'NWN-014',
    status: 'active',
    joinedDate: '2025-02-15',
    expiryDate: '2026-12-31',
    notes: 'Long-time club racer',
  },
  {
    id: 'mem-3',
    fullName: 'Liam Thompson',
    email: 'liam.thompson.rc@outlook.com',
    phone: '07700 900711',
    address: '22 Marton Moss Way',
    postcode: 'FY4 5EJ',
    emergencyContactName: 'Paul Thompson (Parent)',
    emergencyContactPhone: '07700 900712',
    brcaNumber: 'BRCA-58204',
    primaryClass: '1/8 E-Buggy',
    membershipType: 'Junior (Under 16)',
    membershipNumber: 'NWN-028',
    status: 'active',
    joinedDate: '2025-03-01',
    expiryDate: '2026-12-31',
    notes: 'Junior rising star',
  },
  {
    id: 'mem-4',
    fullName: 'Callum Gallagher',
    email: 'callum.gallagher@racing.uk',
    phone: '07700 900994',
    address: '5 Westcliffe Drive, Blackpool',
    postcode: 'FY3 7DL',
    emergencyContactName: 'Karen Gallagher',
    emergencyContactPhone: '07700 900995',
    brcaNumber: 'BRCA-61108',
    primaryClass: '1/8 Nitro Buggy',
    membershipType: 'Adult',
    membershipNumber: null, // Pending assignment!
    status: 'pending',
    joinedDate: '2026-05-18',
    expiryDate: '2026-12-31',
    notes: 'Awaiting manual membership number allocation',
  },
];

const initialEntries: EventEntry[] = [
  {
    id: 'ent-1',
    eventId: 'evt-summer-rd4',
    driverName: 'Mark Jenkins',
    email: 'mark.jenkins@nwnitro-racing.co.uk',
    phone: '07700 900142',
    brcaNumber: 'BRCA-41092',
    transponderNumber: '4829103',
    carClass: '1/8 Nitro Buggy',
    isMember: true,
    membershipNumber: 'NWN-001',
    feeCharged: 10,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    createdAt: '2026-05-02T10:15:00.000Z',
  },
  {
    id: 'ent-2',
    eventId: 'evt-summer-rd4',
    driverName: 'David Bradley',
    email: 'dbradley.rc@gmail.com',
    phone: '07700 900582',
    brcaNumber: 'BRCA-38491',
    transponderNumber: '7192840',
    carClass: '1/8 E-Buggy',
    isMember: true,
    membershipNumber: 'NWN-014',
    feeCharged: 10,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    createdAt: '2026-05-03T14:20:00.000Z',
  },
  {
    id: 'ent-3',
    eventId: 'evt-summer-rd4',
    driverName: 'Alex Wright',
    email: 'alex.wright99@sky.com',
    phone: '07700 900331',
    brcaNumber: 'BRCA-52019',
    transponderNumber: '6391024',
    carClass: '1/8 Nitro Buggy',
    isMember: false,
    feeCharged: 15,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: '2026-05-05T09:44:00.000Z',
    notes: 'Visiting driver from Yorkshire',
  },
  {
    id: 'ent-4',
    eventId: 'evt-summer-rd4',
    driverName: 'Liam Thompson',
    email: 'liam.thompson.rc@outlook.com',
    phone: '07700 900711',
    brcaNumber: 'BRCA-58204',
    transponderNumber: '5519823',
    carClass: '1/8 E-Buggy',
    isMember: true,
    membershipNumber: 'NWN-028',
    feeCharged: 10,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: '2026-05-06T18:02:00.000Z',
  }
];

// Rich RC-Results data for Venue 34 (North West Nitro RC Club)
const initialResults: RCMeetingResult[] = [
  {
    id: 'rc-34-summer-rd3',
    rcResultsMeetingId: '34-2026-05-17',
    venueId: 34,
    meetingName: 'North West Nitro Summer Series 2026 - Round 3',
    date: '2026-05-17',
    venueName: 'North West Nitro RC Club, Blackpool',
    externalUrl: 'https://rc-results.com/Viewer/Main/VenueMeetings?venueId=34',
    summary: {
      totalDrivers: 54,
      nitroBuggyWinner: 'Lewis Jones',
      eBuggyWinner: 'David Bradley',
      truggyWinner: 'Steve Hampson',
    },
    classes: [
      {
        className: '1/8 Nitro Buggy',
        finals: [
          {
            finalName: 'A Main Final',
            duration: '20:00',
            results: [
              { position: 1, startNumber: 1, carNumber: 1, driverName: 'Lewis Jones', laps: 34, time: '20:14.281', bestLap: '34.120', averageLap: '35.714' },
              { position: 2, startNumber: 2, carNumber: 2, driverName: 'Mark Jenkins', laps: 34, time: '20:22.904', bestLap: '34.450', averageLap: '35.967' },
              { position: 3, startNumber: 4, carNumber: 4, driverName: 'Graham Alsop', laps: 33, time: '20:05.112', bestLap: '34.610', averageLap: '36.518' },
              { position: 4, startNumber: 3, carNumber: 3, driverName: 'Simon Reeves', laps: 33, time: '20:19.450', bestLap: '35.040', averageLap: '36.953' },
              { position: 5, startNumber: 6, carNumber: 6, driverName: 'Chris Long', laps: 32, time: '20:08.770', bestLap: '35.320', averageLap: '37.774', bumpUp: true },
              { position: 6, startNumber: 5, carNumber: 5, driverName: 'Adam Edwards', laps: 32, time: '20:16.890', bestLap: '35.880', averageLap: '38.027' },
              { position: 7, startNumber: 7, carNumber: 7, driverName: 'Wayne Davis', laps: 31, time: '20:25.100', bestLap: '36.420', averageLap: '39.519' },
              { position: 8, startNumber: 9, carNumber: 9, driverName: 'Robbie Peel', laps: 28, time: '18:40.110', bestLap: '35.910', averageLap: '40.003' },
            ]
          },
          {
            finalName: 'B Main Final',
            duration: '15:00',
            results: [
              { position: 1, startNumber: 2, carNumber: 2, driverName: 'Chris Long', laps: 25, time: '15:12.440', bestLap: '35.400', bumpUp: true },
              { position: 2, startNumber: 1, carNumber: 1, driverName: 'Robbie Peel', laps: 25, time: '15:20.180', bestLap: '35.820', bumpUp: true },
              { position: 3, startNumber: 5, carNumber: 5, driverName: 'Darren Newton', laps: 24, time: '15:04.990', bestLap: '36.190' },
              { position: 4, startNumber: 3, carNumber: 3, driverName: 'Terry Walker', laps: 24, time: '15:18.230', bestLap: '36.750' },
              { position: 5, startNumber: 4, carNumber: 4, driverName: 'Gary Miller', laps: 23, time: '15:25.600', bestLap: '37.310' },
            ]
          }
        ]
      },
      {
        className: '1/8 E-Buggy',
        finals: [
          {
            finalName: 'A Main Final',
            duration: '12:00',
            results: [
              { position: 1, startNumber: 1, carNumber: 1, driverName: 'David Bradley', laps: 21, time: '12:08.410', bestLap: '33.890', averageLap: '34.686' },
              { position: 2, startNumber: 3, carNumber: 3, driverName: 'Liam Thompson', laps: 21, time: '12:15.820', bestLap: '34.050', averageLap: '35.039' },
              { position: 3, startNumber: 2, carNumber: 2, driverName: 'Carl O’Connor', laps: 20, time: '12:02.190', bestLap: '34.340', averageLap: '36.109' },
              { position: 4, startNumber: 4, carNumber: 4, driverName: 'Jamie Booth', laps: 20, time: '12:11.440', bestLap: '34.900', averageLap: '36.572' },
              { position: 5, startNumber: 5, carNumber: 5, driverName: 'Dan Austin', laps: 19, time: '12:09.300', bestLap: '35.420', averageLap: '38.384' },
            ]
          }
        ]
      },
      {
        className: '1/8 Truggy',
        finals: [
          {
            finalName: 'A Main Final',
            duration: '15:00',
            results: [
              { position: 1, startNumber: 1, carNumber: 1, driverName: 'Steve Hampson', laps: 24, time: '15:18.900', bestLap: '36.500' },
              { position: 2, startNumber: 2, carNumber: 2, driverName: 'Peter Robinson', laps: 23, time: '15:04.220', bestLap: '37.120' },
              { position: 3, startNumber: 3, carNumber: 3, driverName: 'Tony Kelly', laps: 22, time: '15:11.440', bestLap: '37.890' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'rc-34-summer-rd2',
    rcResultsMeetingId: '34-2026-04-19',
    venueId: 34,
    meetingName: 'North West Nitro Summer Series 2026 - Round 2',
    date: '2026-04-19',
    venueName: 'North West Nitro RC Club, Blackpool',
    externalUrl: 'https://rc-results.com/Viewer/Main/VenueMeetings?venueId=34',
    summary: {
      totalDrivers: 48,
      nitroBuggyWinner: 'Mark Jenkins',
      eBuggyWinner: 'David Bradley',
    },
    classes: [
      {
        className: '1/8 Nitro Buggy',
        finals: [
          {
            finalName: 'A Main Final',
            duration: '20:00',
            results: [
              { position: 1, startNumber: 2, carNumber: 2, driverName: 'Mark Jenkins', laps: 33, time: '20:08.190', bestLap: '34.800', averageLap: '36.611' },
              { position: 2, startNumber: 1, carNumber: 1, driverName: 'Lewis Jones', laps: 33, time: '20:14.300', bestLap: '34.620', averageLap: '36.796' },
              { position: 3, startNumber: 3, carNumber: 3, driverName: 'Simon Reeves', laps: 32, time: '20:04.700', bestLap: '35.120', averageLap: '37.646' },
              { position: 4, startNumber: 4, carNumber: 4, driverName: 'Chris Long', laps: 32, time: '20:21.850', bestLap: '35.800', averageLap: '38.182' },
              { position: 5, startNumber: 5, carNumber: 5, driverName: 'Wayne Davis', laps: 31, time: '20:11.400', bestLap: '36.310', averageLap: '39.077' },
            ]
          }
        ]
      },
      {
        className: '1/8 E-Buggy',
        finals: [
          {
            finalName: 'A Main Final',
            duration: '12:00',
            results: [
              { position: 1, startNumber: 1, carNumber: 1, driverName: 'David Bradley', laps: 21, time: '12:12.800', bestLap: '34.100', averageLap: '34.895' },
              { position: 2, startNumber: 2, carNumber: 2, driverName: 'Carl O’Connor', laps: 21, time: '12:20.450', bestLap: '34.400', averageLap: '35.259' },
              { position: 3, startNumber: 3, carNumber: 3, driverName: 'Liam Thompson', laps: 20, time: '12:05.100', bestLap: '34.780', averageLap: '36.255' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'rc-34-summer-rd1',
    rcResultsMeetingId: '34-2026-03-22',
    venueId: 34,
    meetingName: 'North West Nitro Summer Series 2026 - Season Opener (Rd 1)',
    date: '2026-03-22',
    venueName: 'North West Nitro RC Club, Blackpool',
    externalUrl: 'https://rc-results.com/Viewer/Main/VenueMeetings?venueId=34',
    summary: {
      totalDrivers: 62,
      nitroBuggyWinner: 'Graham Alsop',
      eBuggyWinner: 'Liam Thompson',
    },
    classes: [
      {
        className: '1/8 Nitro Buggy',
        finals: [
          {
            finalName: 'A Main Final',
            duration: '20:00',
            results: [
              { position: 1, startNumber: 1, carNumber: 1, driverName: 'Graham Alsop', laps: 35, time: '20:18.900', bestLap: '33.910', averageLap: '34.825' },
              { position: 2, startNumber: 3, carNumber: 3, driverName: 'Mark Jenkins', laps: 34, time: '20:09.150', bestLap: '34.250', averageLap: '35.563' },
              { position: 3, startNumber: 2, carNumber: 2, driverName: 'Lewis Jones', laps: 34, time: '20:19.400', bestLap: '34.100', averageLap: '35.864' },
              { position: 4, startNumber: 5, carNumber: 5, driverName: 'Adam Edwards', laps: 33, time: '20:12.300', bestLap: '35.200', averageLap: '36.736' },
            ]
          }
        ]
      },
      {
        className: '1/8 E-Buggy',
        finals: [
          {
            finalName: 'A Main Final',
            duration: '12:00',
            results: [
              { position: 1, startNumber: 2, carNumber: 2, driverName: 'Liam Thompson', laps: 21, time: '12:04.900', bestLap: '33.720', averageLap: '34.519' },
              { position: 2, startNumber: 1, carNumber: 1, driverName: 'David Bradley', laps: 21, time: '12:09.300', bestLap: '33.980', averageLap: '34.728' },
              { position: 3, startNumber: 4, carNumber: 4, driverName: 'Jamie Booth', laps: 20, time: '12:14.200', bestLap: '35.010', averageLap: '36.710' },
            ]
          }
        ]
      }
    ]
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      events: initialEvents,
      entries: initialEntries,
      members: initialMembers,
      results: initialResults,
      settings: initialSettings,
    };
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        this.data = {
          events: parsed.events || initialEvents,
          entries: parsed.entries || initialEntries,
          members: parsed.members || initialMembers,
          results: parsed.results || initialResults,
          settings: { ...initialSettings, ...(parsed.settings || {}) },
        };
      } else {
        this.persist();
      }
    } catch (err) {
      console.error('Error initializing database file, using in-memory store:', err);
    }
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Events
  getEvents(): RaceEvent[] {
    return this.data.events.map(event => {
      const entryCount = this.data.entries.filter(e => e.eventId === event.id).length;
      return { ...event, entryCount };
    });
  }

  getEventById(id: string): RaceEvent | undefined {
    const event = this.data.events.find(e => e.id === id);
    if (!event) return undefined;
    const entryCount = this.data.entries.filter(e => e.eventId === id).length;
    return { ...event, entryCount };
  }

  addEvent(event: Omit<RaceEvent, 'id'>): RaceEvent {
    const newEvent: RaceEvent = {
      ...event,
      id: 'evt-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    };
    this.data.events.unshift(newEvent);
    this.persist();
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<RaceEvent>): RaceEvent | null {
    const index = this.data.events.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.data.events[index] = { ...this.data.events[index], ...updates };
    this.persist();
    return this.data.events[index];
  }

  deleteEvent(id: string): boolean {
    const before = this.data.events.length;
    this.data.events = this.data.events.filter(e => e.id !== id);
    this.data.entries = this.data.entries.filter(e => e.eventId !== id);
    this.persist();
    return this.data.events.length < before;
  }

  // Entries
  getEntries(eventId?: string): EventEntry[] {
    if (eventId) {
      return this.data.entries.filter(e => e.eventId === eventId);
    }
    return this.data.entries;
  }

  addEntry(entry: Omit<EventEntry, 'id' | 'createdAt'>): EventEntry {
    // Determine membership status and apply discount
    let isMember = false;
    let membershipNumber = entry.membershipNumber?.trim().toUpperCase();

    if (membershipNumber) {
      const member = this.data.members.find(
        m => m.membershipNumber?.toUpperCase() === membershipNumber && m.status === 'active'
      );
      if (member) {
        isMember = true;
      }
    }

    // Look up event for fee
    const event = this.getEventById(entry.eventId);
    const standardFee = event ? event.standardFee : this.data.settings.defaultStandardFee;
    const memberFee = event ? event.memberFee : this.data.settings.defaultMemberFee;
    const feeCharged = isMember ? memberFee : standardFee;

    const newEntry: EventEntry = {
      ...entry,
      id: 'ent-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      isMember,
      membershipNumber: isMember ? membershipNumber : undefined,
      feeCharged,
      createdAt: new Date().toISOString(),
    };

    this.data.entries.push(newEntry);
    this.persist();
    return newEntry;
  }

  updateEntryStatus(id: string, paymentStatus: 'pending' | 'paid' | 'refunded'): EventEntry | null {
    const entry = this.data.entries.find(e => e.id === id);
    if (!entry) return null;
    entry.paymentStatus = paymentStatus;
    this.persist();
    return entry;
  }

  // Members
  getMembers(): Member[] {
    return this.data.members;
  }

  addMember(memberData: Omit<Member, 'id' | 'status' | 'membershipNumber' | 'joinedDate' | 'expiryDate'>): Member {
    const now = new Date();
    const expiry = new Date(now.getFullYear(), 11, 31); // End of current year

    const newMember: Member = {
      ...memberData,
      id: 'mem-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      membershipNumber: null, // Pending manual assignment by admin
      status: 'pending',
      joinedDate: now.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
    };

    this.data.members.unshift(newMember);
    this.persist();
    return newMember;
  }

  updateMember(id: string, updates: Partial<Member>): Member | null {
    const index = this.data.members.findIndex(m => m.id === id);
    if (index === -1) return null;
    this.data.members[index] = { ...this.data.members[index], ...updates };
    this.persist();
    return this.data.members[index];
  }

  assignMembershipNumber(id: string, membershipNumber: string, status: 'active' | 'pending' | 'expired' = 'active'): Member | null {
    const member = this.data.members.find(m => m.id === id);
    if (!member) return null;
    member.membershipNumber = membershipNumber.trim().toUpperCase();
    member.status = status;
    this.persist();
    return member;
  }

  verifyMember(query: { emailOrNumber: string }): Member | null {
    const clean = query.emailOrNumber.trim().toLowerCase();
    const member = this.data.members.find(m => {
      const matchEmail = m.email.toLowerCase() === clean;
      const matchNum = m.membershipNumber && m.membershipNumber.toLowerCase() === clean;
      return (matchEmail || matchNum) && m.status === 'active';
    });
    return member || null;
  }

  // Results
  getResults(): RCMeetingResult[] {
    return this.data.results;
  }

  getRecentResults(count = 3): RCMeetingResult[] {
    return this.data.results.slice(0, count);
  }

  getResultById(id: string): RCMeetingResult | undefined {
    return this.data.results.find(r => r.id === id);
  }

  importResult(result: RCMeetingResult): RCMeetingResult {
    const existingIndex = this.data.results.findIndex(r => r.id === result.id || (result.rcResultsMeetingId && r.rcResultsMeetingId === result.rcResultsMeetingId));
    if (existingIndex >= 0) {
      this.data.results[existingIndex] = result;
    } else {
      this.data.results.unshift(result);
    }
    this.persist();
    return result;
  }

  // Settings
  getSettings(): ClubSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<ClubSettings>): ClubSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.persist();
    return this.data.settings;
  }

  // Export full schema for Netlify / Supabase / Backup
  exportData(): DatabaseSchema {
    return this.data;
  }
}

export const db = new Database();
