import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { EventsCalendarView } from './components/EventsCalendarView';
import { EventBookingModal } from './components/EventBookingModal';
import { EntriesListModal } from './components/EntriesListModal';
import { ResultsView } from './components/ResultsView';
import { MembershipView } from './components/MembershipView';
import { TrackInfoView } from './components/TrackInfoView';
import { AdminPortalView } from './components/AdminPortalView';
import { RaceEvent, RCMeetingResult, Member, EventEntry } from './types';
import { getEvents, getRecentResults, getAllResults, verifyMember } from './lib/api';
import { 
  Trophy, 
  MapPin, 
  Shield, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  Phone, 
  Mail, 
  Heart,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'events' | 'results' | 'membership' | 'track' | 'admin'>('home');
  
  // Data state
  const [events, setEvents] = useState<RaceEvent[]>([]);
  const [recentResults, setRecentResults] = useState<RCMeetingResult[]>([]);
  const [allResults, setAllResults] = useState<RCMeetingResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Logged-in member state (persisted in localStorage)
  const [loggedInMember, setLoggedInMember] = useState<Member | null>(() => {
    try {
      const saved = localStorage.getItem('nwn_logged_in_member');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBookingEvent, setSelectedBookingEvent] = useState<RaceEvent | null>(null);

  const [entriesModalOpen, setEntriesModalOpen] = useState(false);
  const [selectedEntriesEvent, setSelectedEntriesEvent] = useState<RaceEvent | null>(null);

  // Load live data from API
  const refreshAppData = async () => {
    try {
      const [evts, recent, results] = await Promise.all([
        getEvents(),
        getRecentResults(),
        getAllResults(),
      ]);
      setEvents(evts);
      setRecentResults(recent);
      setAllResults(results);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAppData();
  }, []);

  // Handle member login
  const handleLoginMember = (member: Member) => {
    setLoggedInMember(member);
    try {
      localStorage.setItem('nwn_logged_in_member', JSON.stringify(member));
    } catch (e) {
      console.error('Could not save member session:', e);
    }
  };

  // Handle member logout
  const handleLogoutMember = () => {
    setLoggedInMember(null);
    try {
      localStorage.removeItem('nwn_logged_in_member');
    } catch (e) {
      console.error('Could not remove member session:', e);
    }
  };

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-lime-400 selection:text-neutral-950">
      
      {/* Top Motorsport Ticker */}
      <div className="bg-neutral-900 border-b border-neutral-800 text-[11px] py-1.5 px-4 text-center text-neutral-400 flex items-center justify-center gap-3 overflow-hidden">
        <span className="flex items-center gap-1.5 text-lime-400 font-racing font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          Next Race:
        </span>
        <span className="truncate">
          {events[0] ? `${events[0].title} — ${new Date(events[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : 'Summer Series Round 4'}
        </span>
        <span className="hidden sm:inline text-neutral-600">•</span>
        <span className="hidden sm:inline text-neutral-300">
          Members save £5 on every entry
        </span>
        <span className="hidden md:inline text-neutral-600">•</span>
        <span className="hidden md:inline text-neutral-400">
          BRCA Insured • Mythop Rd, Blackpool
        </span>
      </div>

      {/* Navigation Bar */}
      <Navbar
        currentView={currentTab}
        setCurrentView={(view) => setCurrentTab(view as any)}
        loggedInMember={loggedInMember}
        onLogoutMember={handleLogoutMember}
        onOpenLoginModal={() => setCurrentTab('membership')}
        onOpenQuickBookModal={() => {
          if (events.length > 0) {
            setSelectedBookingEvent(events[0]);
            setBookingModalOpen(true);
          } else {
            setCurrentTab('events');
          }
        }}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentTab === 'home' && (
          <HomeView
            events={events}
            recentResults={recentResults}
            loggedInMember={loggedInMember}
            onNavigate={(view) => setCurrentTab(view as any)}
            onBookEvent={(event) => {
              setSelectedBookingEvent(event);
              setBookingModalOpen(true);
            }}
            onOpenMembership={() => setCurrentTab('membership')}
            onOpenLogin={() => setCurrentTab('membership')}
          />
        )}

        {currentTab === 'events' && (
          <EventsCalendarView
            events={events}
            loggedInMember={loggedInMember}
            onBookEvent={(event) => {
              setSelectedBookingEvent(event);
              setBookingModalOpen(true);
            }}
            onViewEntries={(event) => {
              setSelectedEntriesEvent(event);
              setEntriesModalOpen(true);
            }}
            onOpenMembership={() => setCurrentTab('membership')}
          />
        )}

        {currentTab === 'results' && (
          <ResultsView
            results={allResults}
            onImportNewMeeting={() => setCurrentTab('admin')}
          />
        )}

        {currentTab === 'membership' && (
          <MembershipView
            loggedInMember={loggedInMember}
            onLoginMember={handleLoginMember}
            onLogoutMember={handleLogoutMember}
            onNavigateToCalendar={() => setCurrentTab('events')}
          />
        )}

        {currentTab === 'track' && (
          <TrackInfoView
            onNavigateToCalendar={() => setCurrentTab('events')}
            onNavigateToMembership={() => setCurrentTab('membership')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPortalView
            onRefreshData={refreshAppData}
          />
        )}
      </main>

      {/* Event Booking Modal */}
      <EventBookingModal
        event={selectedBookingEvent}
        loggedInMember={loggedInMember}
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedBookingEvent(null);
        }}
        onSuccess={(entry: EventEntry) => {
          refreshAppData();
        }}
      />

      {/* Entered Drivers List Modal */}
      <EntriesListModal
        event={selectedEntriesEvent}
        isOpen={entriesModalOpen}
        onClose={() => {
          setEntriesModalOpen(false);
          setSelectedEntriesEvent(null);
        }}
      />

      {/* Global Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800/80 pt-16 pb-12 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Col 1: Brand & Logo */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.jpg"
                  alt="North West Nitro Logo"
                  className="w-12 h-12 rounded object-contain mix-blend-screen"
                />
                <div>
                  <span className="font-racing font-extrabold text-xl tracking-wider text-white">
                    NORTH WEST <span className="text-lime-400">NITRO</span>
                  </span>
                  <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-mono">
                    1/8 Off-Road Radio Control Car Club
                  </p>
                </div>
              </div>

              <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
                Blackpool's premier 1/8 nitro and electric off-road RC motorsport facility. Off Road Circuit, high-speed jumps, AMB MyLaps timing, and warm community racing since establishment.
              </p>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500">
                <Shield className="w-4 h-4 text-lime-400 flex-shrink-0" />
                <span>BRCA Affiliated Club • Fully Insured Off-Road Track</span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-3">
              <h4 className="font-racing font-bold text-white uppercase text-xs tracking-wider">
                Explore Website
              </h4>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <button onClick={() => setCurrentTab('home')} className="hover:text-lime-400 cursor-pointer">
                    Club Home
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('events')} className="hover:text-lime-400 cursor-pointer">
                    Race Calendar & Booking
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('results')} className="hover:text-lime-400 cursor-pointer">
                    Race Results (Venue 34)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('membership')} className="hover:text-lime-400 cursor-pointer">
                    Club Membership (£5 Discount)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('track')} className="hover:text-lime-400 cursor-pointer">
                    Track Location & Facilities
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Track & Timings */}
            <div className="space-y-3">
              <h4 className="font-racing font-bold text-white uppercase text-xs tracking-wider">
                Track Location
              </h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                North West Nitro<br />
                Mythop Road, Blackpool<br />
                Lancashire, FY4 4XN<br />
                United Kingdom
              </p>
              <div className="text-[11px] text-neutral-400 pt-1">
                <span className="text-white font-semibold block">Sunday Timings:</span>
                <span>Gates: 07:30 • Briefing: 08:45 • Racing: 09:00</span>
              </div>
            </div>

            {/* Col 4: Committee & Backend */}
            <div className="space-y-3">
              <h4 className="font-racing font-bold text-white uppercase text-xs tracking-wider">
                Administration
              </h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Officials and race control backend access to manage calendars, assign numbers, and sync results.
              </p>
              <button
                id="footer-btn-admin"
                onClick={() => setCurrentTab('admin')}
                className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-lime-400 hover:text-lime-300 font-racing font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Committee Portal</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* Bottom Line */}
          <div className="pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
            <p>
              © {new Date().getFullYear()} North West Nitro RC Club. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://rc-results.com/Viewer/Main/VenueMeetings?venueId=34"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-300 flex items-center gap-1"
              >
                <span>RC-Results Venue 34</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <a
                href="https://www.brca.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-300 flex items-center gap-1"
              >
                <span>BRCA Official</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <button onClick={() => setCurrentTab('admin')} className="hover:text-neutral-300 cursor-pointer">
                Netlify Guide
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
