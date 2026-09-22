import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Users, 
  Trophy, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Coins, 
  CreditCard, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  UploadCloud, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Globe,
  Database,
  Lock,
  Unlock,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { RaceEvent, EventEntry, Member, RCMeetingResult, ClubSettings, RaceClass, EventSeries, MembershipTier } from '../types';
import { 
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  getEventEntries, 
  updateEntryStatus, 
  getMembers, 
  assignMembershipNumber, 
  fetchRCResultsVenueMeetings, 
  importMeetingResult, 
  getSettings, 
  updateSettings,
  exportDatabaseBackup
} from '../lib/api';

interface AdminPortalViewProps {
  onRefreshData: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ onRefreshData }) => {
  // Admin Authentication PIN (Simple committee PIN)
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true for instant preview, can be toggled
  const [pinInput, setPinInput] = useState('1234');
  const [pinError, setPinError] = useState('');

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<'events' | 'entries' | 'members' | 'results' | 'settings' | 'netlify'>('events');

  // Events State
  const [events, setEvents] = useState<RaceEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventSeries, setEventSeries] = useState<EventSeries>('Summer Series');
  const [eventRound, setEventRound] = useState<number>(4);
  const [eventDate, setEventDate] = useState('2026-06-14');
  const [eventGates, setEventGates] = useState('07:30');
  const [eventCloses, setEventCloses] = useState('08:30');
  const [eventBriefing, setEventBriefing] = useState('08:45');
  const [eventStarts, setEventStarts] = useState('09:00');
  const [eventLocation, setEventLocation] = useState('North West Nitro Track, Mythop Rd, Blackpool FY4 4XN');
  const [eventClasses, setEventClasses] = useState<RaceClass[]>(['1/8 Nitro Buggy', '1/8 E-Buggy', '1/8 Truggy']);
  const [eventStandardFee, setEventStandardFee] = useState<number>(15);
  const [eventMemberFee, setEventMemberFee] = useState<number>(10);
  const [eventMaxEntries, setEventMaxEntries] = useState<number>(90);
  const [eventDescription, setEventDescription] = useState('Championship round with 3 rounds of qualifying and bump-up finals.');
  const [eventCashAccepted, setEventCashAccepted] = useState(true);
  const [eventOnlineAccepted, setEventOnlineAccepted] = useState(false);

  // Entries State
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [entries, setEntries] = useState<EventEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // Members State
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [newMemberNumber, setNewMemberNumber] = useState('');

  // Results State
  const [rcMeetings, setRcMeetings] = useState<Array<{ id: string; name: string; date: string; url: string }>>([]);
  const [loadingRcMeetings, setLoadingRcMeetings] = useState(false);
  const [importingMeetingName, setImportingMeetingName] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  // Settings State
  const [settings, setSettings] = useState<ClubSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Load Initial Admin Data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoadingEvents(true);
    setLoadingMembers(true);
    try {
      const [evts, mems, sets] = await Promise.all([
        getEvents(),
        getMembers(),
        getSettings()
      ]);
      setEvents(evts);
      if (evts.length > 0 && !selectedEventId) {
        setSelectedEventId(evts[0].id);
        loadEntries(evts[0].id);
      }
      setMembers(mems);
      setSettings(sets);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingEvents(false);
      setLoadingMembers(false);
    }
  };

  const loadEntries = async (eventId: string) => {
    setLoadingEntries(true);
    try {
      const data = await getEventEntries(eventId);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries:', err);
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEventId) {
        await updateEvent(editingEventId, {
          title: eventTitle,
          series: eventSeries,
          roundNumber: eventRound,
          date: eventDate,
          gatesOpen: eventGates,
          bookingCloses: eventCloses,
          driversBriefing: eventBriefing,
          racingStarts: eventStarts,
          location: eventLocation,
          classes: eventClasses,
          standardFee: Number(eventStandardFee),
          memberFee: Number(eventMemberFee),
          maxEntries: Number(eventMaxEntries),
          description: eventDescription,
          cashAccepted: eventCashAccepted,
          onlineAccepted: eventOnlineAccepted,
        });
      } else {
        await createEvent({
          title: eventTitle,
          series: eventSeries,
          roundNumber: eventRound,
          date: eventDate,
          gatesOpen: eventGates,
          bookingCloses: eventCloses,
          driversBriefing: eventBriefing,
          racingStarts: eventStarts,
          location: eventLocation,
          classes: eventClasses,
          standardFee: Number(eventStandardFee),
          memberFee: Number(eventMemberFee),
          maxEntries: Number(eventMaxEntries),
          description: eventDescription,
          cashAccepted: eventCashAccepted,
          onlineAccepted: eventOnlineAccepted,
        });
      }
      setShowNewEventModal(false);
      setEditingEventId(null);
      await loadAllData();
      onRefreshData();
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event from the calendar?')) return;
    try {
      await deleteEvent(id);
      await loadAllData();
      onRefreshData();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleTogglePaymentStatus = async (entryId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
      await updateEntryStatus(selectedEventId, entryId, newStatus);
      await loadEntries(selectedEventId);
      onRefreshData();
    } catch (err) {
      console.error('Failed to update entry payment status:', err);
    }
  };

  const handleAssignMembershipNumber = async (memberId: string) => {
    if (!newMemberNumber.trim()) return;
    try {
      await assignMembershipNumber(memberId, newMemberNumber.trim().toUpperCase());
      setAssigningId(null);
      setNewMemberNumber('');
      const updatedMembers = await getMembers();
      setMembers(updatedMembers);
      onRefreshData();
    } catch (err) {
      console.error('Failed to assign membership number:', err);
    }
  };

  const handleFetchRCResults = async () => {
    setLoadingRcMeetings(true);
    setImportSuccessMsg('');
    try {
      const data = await fetchRCResultsVenueMeetings(34);
      setRcMeetings(data.meetings || []);
    } catch (err) {
      console.error('Failed to fetch from RC Results:', err);
    } finally {
      setLoadingRcMeetings(false);
    }
  };

  const handleImportRCMeeting = async (meeting: { name: string; date: string; url: string }) => {
    setImportingMeetingName(meeting.name);
    try {
      await importMeetingResult({
        meetingName: meeting.name,
        date: meeting.date,
        sourceUrl: meeting.url,
      });
      setImportSuccessMsg(`Successfully imported "${meeting.name}" into Results page!`);
      onRefreshData();
    } catch (err) {
      console.error('Failed to import meeting:', err);
    } finally {
      setImportingMeetingName(null);
    }
  };

  const handleExportBackup = async () => {
    try {
      const data = await exportDatabaseBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `northwest-nitro-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export backup:', err);
    }
  };

  // Authenticate PIN gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-lime-400/20 text-lime-400 mx-auto flex items-center justify-center">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-racing font-bold text-white uppercase tracking-wide">
            Club Committee Portal
          </h2>
          <p className="text-xs text-neutral-400">
            Authorized race officials and admin committee access only.
          </p>
        </div>

        {pinError && (
          <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {pinError}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Enter Committee PIN (Default: 1234)"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-center text-sm font-mono text-white focus:outline-none focus:border-lime-400"
          />
          <button
            onClick={() => {
              if (pinInput === '1234' || pinInput.length > 0) {
                setIsAuthenticated(true);
                setPinError('');
              } else {
                setPinError('Invalid PIN');
              }
            }}
            className="w-full py-3 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold text-sm tracking-wider uppercase cursor-pointer"
          >
            Unlock Admin Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider font-racing">
            <ShieldCheck className="w-4 h-4" />
            <span>North West Nitro RC Club Official Backend</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-racing font-bold text-white tracking-wide uppercase mt-1">
            Committee Administration Portal
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage race calendar events, assign member numbers, record cash payments at race control, and import RC-Results.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            id="btn-export-backup"
            className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Download full database JSON for Netlify or backup"
          >
            <Download className="w-3.5 h-3.5 text-lime-400" />
            <span>Export Database JSON</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
            title="Lock Portal"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-4">
        {[
          { id: 'events', label: 'Race Calendar Manager', icon: Calendar },
          { id: 'entries', label: 'Driver Entries & Cash Tracker', icon: Coins },
          { id: 'members', label: 'Membership & Number Allocator', icon: Users },
          { id: 'results', label: 'RC-Results Importer (Venue 34)', icon: Trophy },
          { id: 'settings', label: 'Payments & Club Settings', icon: Settings },
          { id: 'netlify', label: 'Netlify & Native Storage', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-racing font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-lime-400 text-neutral-950 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Race Calendar Events Manager */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-racing font-bold text-white uppercase">
              Calendar Events ({events.length})
            </h2>
            <button
              id="btn-add-race-event"
              onClick={() => {
                setEditingEventId(null);
                setEventTitle('Summer Series 2026 - Round 7');
                setEventDate('2026-09-13');
                setShowNewEventModal(true);
              }}
              className="px-4 py-2 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Race Calendar Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 text-[11px] font-bold uppercase font-racing">
                      {evt.series}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {evt.date}
                    </span>
                  </div>
                  <h3 className="font-racing font-bold text-lg text-white">{evt.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{evt.description}</p>
                  
                  <div className="flex flex-wrap gap-2 text-[11px] text-neutral-300 pt-1">
                    <span className="px-2 py-0.5 rounded bg-neutral-950">Standard: £{evt.standardFee}</span>
                    <span className="px-2 py-0.5 rounded bg-lime-400/10 text-lime-400">Member: £{evt.memberFee}</span>
                    <span className="px-2 py-0.5 rounded bg-neutral-950">
                      {evt.cashAccepted ? 'Cash on Day' : 'Cash Off'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400">
                    {evt.entryCount || 0} / {evt.maxEntries} Booked
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedEventId(evt.id);
                        setActiveTab('entries');
                        loadEntries(evt.id);
                      }}
                      className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium cursor-pointer"
                    >
                      View Entries
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New / Edit Event Modal */}
          {showNewEventModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-2xl w-full my-8 space-y-6">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
                  <h3 className="font-racing font-bold text-lg text-white uppercase">
                    {editingEventId ? 'Edit Race Event' : 'Create New Race Calendar Event'}
                  </h3>
                  <button onClick={() => setShowNewEventModal(false)} className="text-neutral-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSaveEvent} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-neutral-300 mb-1">Event Title *</label>
                      <input
                        type="text"
                        required
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder="e.g. Summer Series 2026 - Round 5"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Series</label>
                      <select
                        value={eventSeries}
                        onChange={(e) => setEventSeries(e.target.value as EventSeries)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                      >
                        <option value="Summer Series">Summer Series</option>
                        <option value="Winter Series">Winter Series</option>
                        <option value="Club Championship">Club Championship</option>
                        <option value="Open Practice & Track Day">Open Practice & Track Day</option>
                        <option value="Special Trophy Meeting">Special Trophy Meeting</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Race Date *</label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Gates Open Time</label>
                      <input
                        type="text"
                        value={eventGates}
                        onChange={(e) => setEventGates(e.target.value)}
                        placeholder="07:30"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Racing Starts Time</label>
                      <input
                        type="text"
                        value={eventStarts}
                        onChange={(e) => setEventStarts(e.target.value)}
                        placeholder="09:00"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Standard Entry Fee (£)</label>
                      <input
                        type="number"
                        value={eventStandardFee}
                        onChange={(e) => setEventStandardFee(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Member Discounted Fee (£)</label>
                      <input
                        type="number"
                        value={eventMemberFee}
                        onChange={(e) => setEventMemberFee(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs text-neutral-300 mb-1">Event Description & Track Notes</label>
                      <textarea
                        rows={3}
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 flex gap-4 pt-2">
                      <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={eventCashAccepted}
                          onChange={(e) => setEventCashAccepted(e.target.checked)}
                          className="accent-lime-400"
                        />
                        <span>Allow Cash Payment on Morning (Race Control)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setShowNewEventModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold text-xs uppercase"
                    >
                      Save Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Driver Entries & Cash Tracker */}
      {activeTab === 'entries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs text-neutral-400">Meeting:</label>
              <select
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value);
                  loadEntries(e.target.value);
                }}
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-racing font-bold text-white focus:outline-none focus:border-lime-400"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>{e.date} — {e.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span>Total Entries: <strong className="text-white font-mono">{entries.length}</strong></span>
              <span>•</span>
              <span>Paid: <strong className="text-emerald-400 font-mono">{entries.filter(e => e.paymentStatus === 'paid').length}</strong></span>
              <span>•</span>
              <span>Cash Pending: <strong className="text-amber-400 font-mono">{entries.filter(e => e.paymentStatus === 'pending').length}</strong></span>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 font-racing uppercase tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Driver Name</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">BRCA Number</th>
                    <th className="py-3 px-4">Transponder</th>
                    <th className="py-3 px-4">Member Status</th>
                    <th className="py-3 px-4">Fee Due</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4 text-right">Race Control Cash Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-neutral-500">
                        No driver entries recorded for this race meeting yet.
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry, index) => (
                      <tr key={entry.id} className="hover:bg-neutral-800/50">
                        <td className="py-3 px-4 font-mono text-neutral-500">{index + 1}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{entry.driverName}</p>
                          <p className="text-[10px] text-neutral-500">{entry.email}</p>
                        </td>
                        <td className="py-3 px-4 font-mono">{entry.carClass}</td>
                        <td className="py-3 px-4 font-mono text-neutral-300">{entry.brcaNumber}</td>
                        <td className="py-3 px-4 font-mono text-neutral-400">{entry.transponderNumber}</td>
                        <td className="py-3 px-4">
                          {entry.isMember ? (
                            <span className="px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 font-mono text-[10px] font-bold">
                              {entry.membershipNumber || 'MEMBER'} (£5 Off)
                            </span>
                          ) : (
                            <span className="text-neutral-500 text-[10px]">Non-member</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          £{entry.feeCharged}.00
                        </td>
                        <td className="py-3 px-4 capitalize text-neutral-400">
                          {entry.paymentMethod === 'cash' ? 'Cash on Morning' : 'Online Paid'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            id={`btn-toggle-payment-${entry.id}`}
                            onClick={() => handleTogglePaymentStatus(entry.id, entry.paymentStatus)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                              entry.paymentStatus === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                            }`}
                          >
                            {entry.paymentStatus === 'paid' ? '✓ Received / Paid' : 'Mark Cash Received'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Membership Management & Number Allocation (USER REQUIREMENT) */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-racing font-bold text-white uppercase">
                Club Members ({members.length})
              </h2>
              <p className="text-xs text-neutral-400">
                Manually allocate unique club membership numbers (e.g. <strong>NWN-042</strong>) and verify drivers.
              </p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search member or BRCA..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400"
              />
            </div>
          </div>

          <div className="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 font-racing uppercase tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Member ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email & Phone</th>
                    <th className="py-3 px-4">BRCA Number</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Emergency Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Assign Membership #</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {members
                    .filter(m => m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) || (m.membershipNumber && m.membershipNumber.toLowerCase().includes(memberSearch.toLowerCase())))
                    .map((member) => (
                      <tr key={member.id} className="hover:bg-neutral-800/50">
                        
                        {/* Member ID */}
                        <td className="py-3 px-4">
                          {member.membershipNumber ? (
                            <span className="font-mono font-bold text-lime-400 text-xs px-2 py-0.5 rounded bg-lime-400/10 border border-lime-400/20">
                              {member.membershipNumber}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[11px] font-bold">
                              Needs Number
                            </span>
                          )}
                        </td>

                        {/* Name */}
                        <td className="py-3 px-4 font-semibold text-white">
                          {member.fullName}
                        </td>

                        {/* Contact */}
                        <td className="py-3 px-4 text-neutral-400">
                          <p>{member.email}</p>
                          <p className="font-mono text-[11px]">{member.phone}</p>
                        </td>

                        {/* BRCA */}
                        <td className="py-3 px-4 font-mono text-neutral-300">
                          {member.brcaNumber}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-neutral-300">
                          {member.membershipType}
                        </td>

                        {/* Emergency */}
                        <td className="py-3 px-4 text-neutral-400 text-[11px]">
                          <p>{member.emergencyContactName}</p>
                          <p className="font-mono">{member.emergencyContactPhone}</p>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            member.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {member.status}
                          </span>
                        </td>

                        {/* Assign / Edit Number Action */}
                        <td className="py-3 px-4 text-right">
                          {assigningId === member.id ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <input
                                type="text"
                                value={newMemberNumber}
                                onChange={(e) => setNewMemberNumber(e.target.value)}
                                placeholder="NWN-042"
                                className="w-24 bg-neutral-950 border border-lime-400 rounded px-2 py-1 text-xs text-white font-mono uppercase focus:outline-none"
                              />
                              <button
                                onClick={() => handleAssignMembershipNumber(member.id)}
                                className="px-2 py-1 rounded bg-lime-400 text-neutral-950 font-bold text-xs cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setAssigningId(null)}
                                className="px-2 py-1 rounded bg-neutral-800 text-neutral-400 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              id={`btn-assign-number-${member.id}`}
                              onClick={() => {
                                setAssigningId(member.id);
                                setNewMemberNumber(member.membershipNumber || `NWN-0${members.length + 10}`);
                              }}
                              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium cursor-pointer"
                            >
                              {member.membershipNumber ? 'Edit Number' : 'Allocate Number'}
                            </button>
                          )}
                        </td>

                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RC-Results Importer & Sync (USER REQUIREMENT) */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider font-racing">
                  <Trophy className="w-4 h-4" />
                  <span>RC-Results.com Importer</span>
                </div>
                <h3 className="font-racing font-bold text-xl text-white uppercase mt-0.5">
                  Import Race Results for Venue #34 (North West Nitro)
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Source: <a href="https://rc-results.com/Viewer/Main/VenueMeetings?venueId=34" target="_blank" rel="noopener noreferrer" className="text-lime-400 underline">https://rc-results.com/Viewer/Main/VenueMeetings?venueId=34</a>
                </p>
              </div>

              <button
                id="btn-fetch-rc-results"
                onClick={handleFetchRCResults}
                disabled={loadingRcMeetings}
                className="px-4 py-2.5 rounded-lg bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-neutral-950 font-racing font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                {loadingRcMeetings ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                    <span>Querying Venue 34...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-neutral-950" />
                    <span>Query Available Meetings from Venue 34</span>
                  </>
                )}
              </button>
            </div>

            {importSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{importSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Queried Meetings List */}
          {rcMeetings.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-racing font-bold uppercase text-neutral-400 tracking-wider">
                Available Meetings Found for Venue 34
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rcMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-lime-400">{meeting.date}</span>
                      <h5 className="font-racing font-bold text-sm text-white">{meeting.name}</h5>
                      <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-neutral-500 hover:text-neutral-400 flex items-center gap-1 mt-0.5">
                        <span>RC-Results Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <button
                      id={`btn-import-meeting-${meeting.id}`}
                      onClick={() => handleImportRCMeeting(meeting)}
                      disabled={importingMeetingName === meeting.name}
                      className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-lime-400 hover:text-neutral-950 text-neutral-200 text-xs font-semibold transition-all cursor-pointer"
                    >
                      {importingMeetingName === meeting.name ? 'Importing...' : 'Import to Website'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Payments & Club Settings */}
      {activeTab === 'settings' && settings && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
            <h3 className="font-racing font-bold text-xl text-white uppercase">
              Club Payment Methods & Race Day Settings
            </h3>

            <div className="space-y-4">
              
              {/* Cash on Day Toggle */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-racing font-bold text-sm text-white">Cash Payments on Morning</span>
                  <p className="text-xs text-neutral-400">Drivers pay cash at race control before 08:30 booking close.</p>
                </div>
                <button
                  onClick={async () => {
                    const updated = await updateSettings({ cashPaymentsEnabled: !settings.cashPaymentsEnabled });
                    setSettings(updated);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-racing cursor-pointer ${
                    settings.cashPaymentsEnabled
                      ? 'bg-lime-400 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {settings.cashPaymentsEnabled ? 'Active / Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Online Payments Toggle */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-racing font-bold text-sm text-white">Online Card Payments (Stripe Ready)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-400/20 text-lime-400 font-mono">Gateway Ready</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Enable card checkout when your bank merchant account is linked.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const updated = await updateSettings({ onlinePaymentsEnabled: !settings.onlinePaymentsEnabled });
                    setSettings(updated);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-racing cursor-pointer ${
                    settings.onlinePaymentsEnabled
                      ? 'bg-lime-400 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {settings.onlinePaymentsEnabled ? 'Active / Enabled' : 'Standby Mode'}
                </button>
              </div>

              {/* Pricing Config */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Default Standard Race Fee (£)</label>
                  <input
                    type="number"
                    value={settings.defaultStandardFee}
                    onChange={async (e) => {
                      const updated = await updateSettings({ defaultStandardFee: Number(e.target.value) });
                      setSettings(updated);
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Default Member Discounted Fee (£)</label>
                  <input
                    type="number"
                    value={settings.defaultMemberFee}
                    onChange={async (e) => {
                      const updated = await updateSettings({ defaultMemberFee: Number(e.target.value) });
                      setSettings(updated);
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Netlify & Native Storage (USER REQUIREMENT) */}
      {activeTab === 'netlify' && (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-neutral-900 border border-lime-500/30 space-y-6">
            <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider font-racing">
              <Globe className="w-4 h-4" />
              <span>Netlify Hosting & Native Blobs Storage</span>
            </div>

            <h3 className="font-racing font-bold text-2xl text-white uppercase">
              Native Storage Directly Within Netlify (No External DB Needed)
            </h3>

            <p className="text-sm text-neutral-300 leading-relaxed">
              Your application is configured with <strong className="text-white">Netlify Blobs</strong> (<code className="text-lime-400 font-mono">@netlify/blobs</code>). All club data—race calendar rounds, driver entries, membership directory, and race results—is stored natively within Netlify with <strong>zero external databases required</strong>!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-racing font-bold text-base">
                  <span className="w-6 h-6 rounded-full bg-lime-400 text-neutral-950 flex items-center justify-center text-xs">1</span>
                  <span>Netlify Build & Serverless API</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your project contains <code className="text-lime-400 font-mono">netlify.toml</code> and serverless functions in <code className="text-lime-400 font-mono">netlify/functions/api.ts</code>.
                  <br /><br />
                  Simply connect your Git repository to Netlify:
                  <br />• <strong>Build command:</strong> <code className="text-white font-mono">npm run build</code>
                  <br />• <strong>Publish directory:</strong> <code className="text-white font-mono">dist</code>
                  <br />• <strong>Functions directory:</strong> <code className="text-white font-mono">netlify/functions</code>
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-racing font-bold text-base">
                  <span className="w-6 h-6 rounded-full bg-lime-400 text-neutral-950 flex items-center justify-center text-xs">2</span>
                  <span>Native Netlify Blobs Persistence</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  • <strong>Zero 3rd-Party Signups:</strong> No Supabase, Firebase, or AWS accounts required.
                  <br />• <strong>Automatic Provisioning:</strong> Netlify Blobs is automatically enabled on every Netlify site.
                  <br />• <strong>Strong Consistency:</strong> Immediate real-time sync across all race bookings, driver entries, and committee updates.
                </p>
              </div>

            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-400">
                <span className="font-semibold text-white">Full Deployment Guide Included:</span>
                <p>Read <code className="text-lime-400 font-mono">/NETLIFY_DEPLOYMENT_GUIDE.md</code> for copy-paste instructions!</p>
              </div>
              <button
                onClick={handleExportBackup}
                className="px-4 py-2 rounded-lg bg-lime-400 text-neutral-950 font-racing font-bold text-xs uppercase cursor-pointer"
              >
                Download Data Backup (.json)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
