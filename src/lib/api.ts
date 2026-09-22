import { RaceEvent, EventEntry, Member, RCMeetingResult, ClubSettings } from '../types';

const API_BASE = '/api';

export async function getEvents(): Promise<RaceEvent[]> {
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function createEvent(event: Partial<RaceEvent>): Promise<RaceEvent> {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

export async function updateEvent(id: string, updates: Partial<RaceEvent>): Promise<RaceEvent> {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update event');
  return res.json();
}

export async function deleteEvent(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete event');
  return true;
}

export async function getEventEntries(eventId: string): Promise<EventEntry[]> {
  const res = await fetch(`${API_BASE}/events/${eventId}/entries`);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return res.json();
}

export async function createEntry(eventId: string, entryData: Partial<EventEntry>): Promise<EventEntry> {
  const res = await fetch(`${API_BASE}/events/${eventId}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entryData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit entry');
  }
  return res.json();
}

export async function updateEntryStatus(eventId: string, entryId: string, paymentStatus: 'pending' | 'paid' | 'refunded'): Promise<EventEntry> {
  const res = await fetch(`${API_BASE}/events/${eventId}/entries/${entryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentStatus }),
  });
  if (!res.ok) throw new Error('Failed to update payment status');
  return res.json();
}

export async function getMembers(): Promise<Member[]> {
  const res = await fetch(`${API_BASE}/members`);
  if (!res.ok) throw new Error('Failed to fetch members');
  return res.json();
}

export async function registerMember(memberData: Partial<Member>): Promise<Member> {
  const res = await fetch(`${API_BASE}/members/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to register membership');
  }
  return res.json();
}

export async function assignMembershipNumber(id: string, membershipNumber: string, status = 'active'): Promise<Member> {
  const res = await fetch(`${API_BASE}/members/${id}/assign-number`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ membershipNumber, status }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to assign membership number');
  }
  return res.json();
}

export async function verifyMember(emailOrNumber: string): Promise<{ valid: boolean; member?: Member }> {
  const res = await fetch(`${API_BASE}/members/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrNumber }),
  });
  if (!res.ok) {
    return { valid: false };
  }
  return res.json();
}

export async function getResults(): Promise<RCMeetingResult[]> {
  const res = await fetch(`${API_BASE}/results`);
  if (!res.ok) throw new Error('Failed to fetch results');
  return res.json();
}

export const getAllResults = getResults;

export async function getRecentResults(count = 3): Promise<RCMeetingResult[]> {
  const res = await fetch(`${API_BASE}/results/recent?count=${count}`);
  if (!res.ok) throw new Error('Failed to fetch recent results');
  return res.json();
}

export async function fetchRCResultsVenueMeetings(venueId = 34) {
  const res = await fetch(`${API_BASE}/results-import/venue-meetings?venueId=${venueId}`);
  if (!res.ok) throw new Error('Failed to query venue meetings');
  return res.json();
}

export async function importMeetingResult(data: { meetingName: string; date?: string; sourceUrl?: string; customData?: any }): Promise<RCMeetingResult> {
  const res = await fetch(`${API_BASE}/results/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to import result');
  }
  return res.json();
}

export async function getSettings(): Promise<ClubSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(settings: Partial<ClubSettings>): Promise<ClubSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export async function exportDatabaseBackup() {
  const res = await fetch(`${API_BASE}/database/export`);
  if (!res.ok) throw new Error('Failed to export database');
  return res.json();
}
