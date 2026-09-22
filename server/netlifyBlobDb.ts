import { getStore } from '@netlify/blobs';
import { db, DatabaseSchema } from './db';
import { RaceEvent, EventEntry, Member, RCMeetingResult, ClubSettings } from '../src/types';

const STORE_NAME = 'northwest-nitro-database';
const DATA_KEY = 'main-store';

/**
 * Netlify Blob Storage Manager
 * Stores all club data natively within Netlify without any external database.
 */
class NetlifyBlobDatabase {
  private memoryCache: DatabaseSchema | null = null;

  private getStoreInstance() {
    try {
      return getStore({
        name: STORE_NAME,
        consistency: 'strong',
      });
    } catch {
      return null;
    }
  }

  async loadData(): Promise<DatabaseSchema> {
    const store = this.getStoreInstance();
    if (!store) {
      // Running outside Netlify (local dev or container), use file-based db
      return db.exportData();
    }

    try {
      const stored = await store.get(DATA_KEY, { type: 'json' });
      if (stored && typeof stored === 'object') {
        this.memoryCache = stored as DatabaseSchema;
        return this.memoryCache;
      }

      // First run on Netlify: initialize Netlify Blob with initial data
      const initial = db.exportData();
      await store.setJSON(DATA_KEY, initial);
      this.memoryCache = initial;
      return initial;
    } catch (err) {
      console.warn('Netlify Blobs load warning, using fallback:', err);
      return db.exportData();
    }
  }

  async saveData(data: DatabaseSchema): Promise<void> {
    this.memoryCache = data;
    const store = this.getStoreInstance();
    if (store) {
      try {
        await store.setJSON(DATA_KEY, data);
        return;
      } catch (err) {
        console.error('Failed to write to Netlify Blobs:', err);
      }
    }
    // Also sync local file if outside Netlify
    // (db automatically persists to file in local mode)
  }

  // Events
  async getEvents(): Promise<RaceEvent[]> {
    const data = await this.loadData();
    return data.events.map(event => {
      const entryCount = data.entries.filter(e => e.eventId === event.id).length;
      return { ...event, entryCount };
    });
  }

  async getEventById(id: string): Promise<RaceEvent | undefined> {
    const data = await this.loadData();
    const event = data.events.find(e => e.id === id);
    if (!event) return undefined;
    const entryCount = data.entries.filter(e => e.eventId === id).length;
    return { ...event, entryCount };
  }

  async addEvent(event: Omit<RaceEvent, 'id'>): Promise<RaceEvent> {
    const data = await this.loadData();
    const newEvent: RaceEvent = {
      ...event,
      id: 'evt-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    };
    data.events.unshift(newEvent);
    await this.saveData(data);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<RaceEvent>): Promise<RaceEvent | null> {
    const data = await this.loadData();
    const index = data.events.findIndex(e => e.id === id);
    if (index === -1) return null;
    data.events[index] = { ...data.events[index], ...updates };
    await this.saveData(data);
    return data.events[index];
  }

  async deleteEvent(id: string): Promise<boolean> {
    const data = await this.loadData();
    const before = data.events.length;
    data.events = data.events.filter(e => e.id !== id);
    data.entries = data.entries.filter(e => e.eventId !== id);
    await this.saveData(data);
    return data.events.length < before;
  }

  // Entries
  async getEntries(eventId?: string): Promise<EventEntry[]> {
    const data = await this.loadData();
    if (eventId) {
      return data.entries.filter(e => e.eventId === eventId);
    }
    return data.entries;
  }

  async addEntry(entry: Omit<EventEntry, 'id' | 'createdAt'>): Promise<EventEntry> {
    const data = await this.loadData();
    let isMember = false;
    const membershipNumber = entry.membershipNumber?.trim().toUpperCase();

    if (membershipNumber) {
      const member = data.members.find(
        m => m.membershipNumber?.toUpperCase() === membershipNumber && m.status === 'active'
      );
      if (member) {
        isMember = true;
      }
    }

    const event = data.events.find(e => e.id === entry.eventId);
    const standardFee = event ? event.standardFee : data.settings.defaultStandardFee;
    const memberFee = event ? event.memberFee : data.settings.defaultMemberFee;
    const feeCharged = isMember ? memberFee : standardFee;

    const newEntry: EventEntry = {
      ...entry,
      id: 'ent-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      isMember,
      membershipNumber: isMember ? membershipNumber : undefined,
      feeCharged,
      createdAt: new Date().toISOString(),
    };

    data.entries.push(newEntry);
    await this.saveData(data);
    return newEntry;
  }

  async updateEntryStatus(id: string, paymentStatus: 'pending' | 'paid' | 'refunded'): Promise<EventEntry | null> {
    const data = await this.loadData();
    const entry = data.entries.find(e => e.id === id);
    if (!entry) return null;
    entry.paymentStatus = paymentStatus;
    await this.saveData(data);
    return entry;
  }

  // Members
  async getMembers(): Promise<Member[]> {
    const data = await this.loadData();
    return data.members;
  }

  async addMember(memberData: Omit<Member, 'id' | 'status' | 'membershipNumber' | 'joinedDate' | 'expiryDate'>): Promise<Member> {
    const data = await this.loadData();
    const now = new Date();
    const expiry = new Date(now.getFullYear(), 11, 31);

    const newMember: Member = {
      ...memberData,
      id: 'mem-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      membershipNumber: null,
      status: 'pending',
      joinedDate: now.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
    };

    data.members.unshift(newMember);
    await this.saveData(data);
    return newMember;
  }

  async updateMember(id: string, updates: Partial<Member>): Promise<Member | null> {
    const data = await this.loadData();
    const index = data.members.findIndex(m => m.id === id);
    if (index === -1) return null;
    data.members[index] = { ...data.members[index], ...updates };
    await this.saveData(data);
    return data.members[index];
  }

  async assignMembershipNumber(id: string, membershipNumber: string, status: 'active' | 'pending' | 'expired' = 'active'): Promise<Member | null> {
    const data = await this.loadData();
    const member = data.members.find(m => m.id === id);
    if (!member) return null;
    member.membershipNumber = membershipNumber.trim().toUpperCase();
    member.status = status;
    await this.saveData(data);
    return member;
  }

  async verifyMember(query: { emailOrNumber: string }): Promise<Member | null> {
    const data = await this.loadData();
    const clean = query.emailOrNumber.trim().toLowerCase();
    const member = data.members.find(m => {
      const matchEmail = m.email.toLowerCase() === clean;
      const matchNum = m.membershipNumber && m.membershipNumber.toLowerCase() === clean;
      return (matchEmail || matchNum) && m.status === 'active';
    });
    return member || null;
  }

  // Results
  async getResults(): Promise<RCMeetingResult[]> {
    const data = await this.loadData();
    return data.results;
  }

  async getRecentResults(count = 3): Promise<RCMeetingResult[]> {
    const data = await this.loadData();
    return data.results.slice(0, count);
  }

  async getResultById(id: string): Promise<RCMeetingResult | undefined> {
    const data = await this.loadData();
    return data.results.find(r => r.id === id);
  }

  async importResult(result: RCMeetingResult): Promise<RCMeetingResult> {
    const data = await this.loadData();
    const existingIndex = data.results.findIndex(
      r => r.id === result.id || (result.rcResultsMeetingId && r.rcResultsMeetingId === result.rcResultsMeetingId)
    );
    if (existingIndex >= 0) {
      data.results[existingIndex] = result;
    } else {
      data.results.unshift(result);
    }
    await this.saveData(data);
    return result;
  }

  // Settings
  async getSettings(): Promise<ClubSettings> {
    const data = await this.loadData();
    return data.settings;
  }

  async updateSettings(updates: Partial<ClubSettings>): Promise<ClubSettings> {
    const data = await this.loadData();
    data.settings = { ...data.settings, ...updates };
    await this.saveData(data);
    return data.settings;
  }

  // Export full schema for backup
  async exportData(): Promise<DatabaseSchema> {
    return this.loadData();
  }
}

export const netlifyBlobDb = new NetlifyBlobDatabase();
