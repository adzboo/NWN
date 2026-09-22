import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Coins, 
  CreditCard, 
  Filter, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { RaceEvent, Member } from '../types';

interface EventsCalendarViewProps {
  events: RaceEvent[];
  loggedInMember: Member | null;
  onBookEvent: (event: RaceEvent) => void;
  onViewEntries: (event: RaceEvent) => void;
  onOpenMembership: () => void;
}

export const EventsCalendarView: React.FC<EventsCalendarViewProps> = ({
  events,
  loggedInMember,
  onBookEvent,
  onViewEntries,
  onOpenMembership,
}) => {
  const [selectedSeries, setSelectedSeries] = useState<string>('all');

  const seriesOptions = [
    { id: 'all', label: 'All Calendar Events' },
    { id: 'Summer Series', label: 'Summer Series 2026' },
    { id: 'Winter Series', label: 'Winter Series' },
    { id: 'Open Practice & Track Day', label: 'Practice Days' },
  ];

  const filteredEvents = selectedSeries === 'all' 
    ? events 
    : events.filter(e => e.series === selectedSeries);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider font-racing">
              <Calendar className="w-4 h-4" />
              <span>North West Nitro 2026 Season</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-racing font-bold text-white tracking-wide uppercase mt-1">
              Race Calendar & Event Booking
            </h1>
            <p className="text-sm text-neutral-400 max-w-3xl mt-1">
              Official race calendar for North West Nitro off-road championships. Sign up below to reserve your grid slot. Cash on the day accepted at race control before 08:30; online payments enabled.
            </p>
          </div>

          {/* Member Discount Notice Box */}
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-3 text-xs">
            <div className="w-9 h-9 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              {loggedInMember ? (
                <div>
                  <p className="font-bold text-lime-400">Member Discount Active</p>
                  <p className="text-neutral-300">You will pay £10 instead of £15 (Save £5!)</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-white">Save £5 on Every Race</p>
                  <p className="text-neutral-400">
                    Members pay £10 vs £15 standard.{' '}
                    <button onClick={onOpenMembership} className="text-lime-400 underline hover:text-lime-300 font-semibold cursor-pointer">
                      Join Club
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Series Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Filter className="w-4 h-4 text-neutral-500 mr-1" />
          {seriesOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedSeries(opt.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedSeries === opt.id
                  ? 'bg-lime-400 text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400">
            <AlertCircle className="w-8 h-8 mx-auto text-neutral-500 mb-2" />
            <p className="font-medium text-white">No race events found for this category.</p>
            <p className="text-xs text-neutral-500 mt-1">Select "All Calendar Events" to see the full club schedule.</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const eventDate = new Date(event.date);
            const isBookingOpen = event.status === 'open';

            return (
              <div
                key={event.id}
                className="rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 p-6 transition-all shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Date Badge + Details */}
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  
                  {/* Calendar Block */}
                  <div className="w-24 h-24 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center flex-shrink-0 text-center p-2">
                    <span className="text-[10px] uppercase font-bold text-lime-400 font-racing tracking-wider">
                      {eventDate.toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                    <span className="text-3xl font-racing font-extrabold text-white leading-none my-0.5">
                      {eventDate.getDate()}
                    </span>
                    <span className="text-[10px] text-neutral-500 uppercase font-medium">
                      {eventDate.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </span>
                  </div>

                  {/* Information Body */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-lime-400/20 text-lime-400 text-xs font-bold uppercase font-racing">
                        {event.series}
                      </span>
                      {event.roundNumber && (
                        <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-xs font-mono">
                          Round {event.roundNumber}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isBookingOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {isBookingOpen ? '● Entries Open' : 'Entries Closed'}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-racing font-bold text-white tracking-wide">
                      {event.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl">
                      {event.description}
                    </p>

                    {/* Schedule times bar */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-lime-400" />
                        <span>Gates: <strong>{event.gatesOpen}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-lime-400" />
                        <span>Briefing: <strong>{event.driversBriefing}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-lime-400" />
                        <span>Racing: <strong>{event.racingStarts}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Blackpool Track</span>
                      </div>
                    </div>

                    {/* Classes tag list */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-neutral-500 mr-1">Classes:</span>
                      {event.classes.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300 text-[11px] font-mono">
                          {c}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Right: Fees, Entries, and Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-800 min-w-[240px]">
                  
                  {/* Pricing Box */}
                  <div className="text-left sm:text-right space-y-1">
                    <div className="flex items-center sm:justify-end gap-2">
                      <span className="text-xs text-neutral-400 line-through">Standard: £{event.standardFee}</span>
                      <span className="px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 font-bold text-xs border border-lime-400/30">
                        Member: £{event.memberFee}
                      </span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-2 text-xs text-neutral-400">
                      <span className="flex items-center gap-1 text-neutral-300">
                        <Coins className="w-3.5 h-3.5 text-lime-400" /> Cash on Day
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-neutral-300">
                        <CreditCard className="w-3.5 h-3.5 text-neutral-400" /> Online Pay
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 sm:text-right font-mono">
                      {event.entryCount || 0} / {event.maxEntries} Drivers Booked
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full">
                    <button
                      id={`btn-book-event-${event.id}`}
                      onClick={() => onBookEvent(event)}
                      disabled={!isBookingOpen}
                      className="w-full px-5 py-2.5 rounded-lg bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-neutral-950 font-racing font-bold text-sm tracking-wide uppercase transition-all shadow-md text-center cursor-pointer active:scale-95"
                    >
                      Enter Race (Cash / Online)
                    </button>

                    <button
                      id={`btn-view-entries-${event.id}`}
                      onClick={() => onViewEntries(event)}
                      className="w-full px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-lime-400" />
                      <span>View Entered Drivers ({event.entryCount || 0})</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Rules & Requirements Box */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 space-y-3">
        <h3 className="font-racing font-bold text-base text-white uppercase flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-lime-400" />
          Race Day Regulations & Marshaling
        </h3>
        <p className="leading-relaxed text-neutral-400">
          • All drivers must hold a valid <strong>BRCA Membership</strong> for personal third-party insurance at the track.
          <br />
          • Booking closes at 08:30 on race day. Drivers must pay cash at race control or complete online checkout before this time.
          <br />
          • <strong>Compulsory Marshaling:</strong> Every driver is required to marshal the race immediately following their own heat or final.
          <br />
          • Transponders: AMB / MyLaps RC4 or MRT compatible. Club loan transponders available at race control.
        </p>
      </div>

    </div>
  );
};
