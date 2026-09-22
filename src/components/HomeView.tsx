import React from 'react';
import { 
  Calendar, 
  Trophy, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Coins, 
  CreditCard, 
  Medal, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { RaceEvent, RCMeetingResult, Member } from '../types';

interface HomeViewProps {
  events: RaceEvent[];
  recentResults: RCMeetingResult[];
  loggedInMember: Member | null;
  onNavigate: (view: string) => void;
  onBookEvent: (event: RaceEvent) => void;
  onOpenMembership: () => void;
  onOpenLogin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  events,
  recentResults,
  loggedInMember,
  onNavigate,
  onBookEvent,
  onOpenMembership,
  onOpenLogin,
}) => {
  const nextEvent = events.find(e => e.status === 'open') || events[0];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800">
        {/* Background ambient lighting effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-neutral-800/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Col: Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-racing font-extrabold tracking-tight uppercase text-white leading-tight">
                High-Octane <span className="text-lime-400 text-glow-lime">1/8 Off-Road</span> RC Racing
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 max-w-2xl font-normal leading-relaxed">
                Welcome to <strong className="text-white">North West Nitro</strong> — the premier dedicated 1/8 scale RC off-road racing facility in the North West. Featuring a fast technical Off Road Circuit, high-speed jumps, covered pit bays, and computerized AMB/MyLaps timing.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {nextEvent && (
                  <button
                    id="btn-hero-book-next"
                    onClick={() => onBookEvent(nextEvent)}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold tracking-wider text-base uppercase transition-all shadow-lg shadow-lime-400/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-5 h-5 text-neutral-950" />
                    <span>Enter Next Race Meeting</span>
                  </button>
                )}

                <button
                  id="btn-hero-view-calendar"
                  onClick={() => onNavigate('events')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-racing font-semibold text-base tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-lime-400" />
                  <span>2026 Race Calendar</span>
                </button>
              </div>

              {/* Perks Highlights */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-neutral-400 border-t border-neutral-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0" />
                  <span>Cash on Day or Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0" />
                  <span>£5 Discount for Members</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0" />
                  <span>Live RC-Results (Venue 34)</span>
                </div>
              </div>

            </div>

            {/* Right Col: Logo Emblem / Interactive Spotlight */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Ambient glow behind card */}
                <div className="absolute -inset-1 bg-gradient-to-b from-lime-500/20 via-lime-500/5 to-transparent rounded-2xl filter blur-xl opacity-75 pointer-events-none" />
                
                <div className="relative rounded-2xl bg-black border border-neutral-800/80 p-6 sm:p-7 text-center overflow-hidden shadow-2xl">
                  
                  {/* Seamless logo presentation with spotlight aura */}
                  <div className="mx-auto w-56 h-56 sm:w-64 sm:h-64 relative flex items-center justify-center mb-3">
                    <div className="absolute inset-4 rounded-full bg-lime-400/10 blur-2xl pointer-events-none" />
                    <img
                      src="/logo.jpg"
                      alt="North West Nitro Official Club Crest"
                      className="w-full h-full object-contain relative z-10 mix-blend-screen drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1 relative z-10">
                    <h3 className="font-racing font-bold text-xl text-white tracking-wide uppercase">
                      North West Nitro RC Club
                    </h3>
                    <p className="text-xs text-neutral-400">Mythop Road, Blackpool • Lancashire FY4 4XN</p>
                  </div>

                  {/* Membership Quick Status Bar */}
                  <div className="mt-5 p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 text-left flex items-center justify-between text-xs relative z-10">
                    <div>
                      <p className="text-neutral-400 font-medium">Club Membership Status</p>
                      {loggedInMember ? (
                        <p className="font-bold text-lime-400 flex items-center gap-1">
                          <span>Active Member: #{loggedInMember.membershipNumber}</span>
                        </p>
                      ) : (
                        <p className="text-neutral-300">Save £5 on entry fees every round</p>
                      )}
                    </div>
                    {loggedInMember ? (
                      <span className="px-2.5 py-1 rounded bg-lime-400/20 text-lime-400 text-[11px] font-bold">
                        Discount Active
                      </span>
                    ) : (
                      <button
                        onClick={onOpenMembership}
                        className="px-3 py-1.5 rounded bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Join / Sign In
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Upcoming Race Feature Section */}
      {nextEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-lime-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-lime-400 text-neutral-950 font-racing font-bold text-xs uppercase tracking-wider">
                    Next Race Meeting
                  </span>
                  <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 text-xs font-semibold">
                    {nextEvent.series}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-lime-400" />
                    Racing starts {nextEvent.racingStarts}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-racing font-bold text-white tracking-wide">
                  {nextEvent.title}
                </h2>

                <p className="text-sm text-neutral-300 max-w-2xl">
                  {nextEvent.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Calendar className="w-4 h-4 text-lime-400" />
                    <span className="font-semibold text-white">{new Date(nextEvent.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <MapPin className="w-4 h-4 text-lime-400" />
                    <span>Blackpool Track (FY4 4XN)</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      Standard: £{nextEvent.standardFee}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 font-bold border border-lime-400/40">
                      Member: £{nextEvent.memberFee} (Save £5)
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Enter Button */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
                <button
                  id="btn-spotlight-enter"
                  onClick={() => onBookEvent(nextEvent)}
                  className="px-6 py-3.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold tracking-wider uppercase text-center text-sm shadow-md transition-all cursor-pointer"
                >
                  Enter Event Now
                </button>
                <button
                  id="btn-spotlight-view-calendar"
                  onClick={() => onNavigate('events')}
                  className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs text-center transition-all cursor-pointer"
                >
                  View Full Calendar & Entries
                </button>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* USER REQUIREMENT: Show the last 3 events results on the home page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider font-racing">
              <Trophy className="w-4 h-4" />
              <span>Official RC-Results Archive (Venue #34)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-racing font-bold text-white tracking-wide mt-1">
              Latest Race Results
            </h2>
            <p className="text-sm text-neutral-400">
              Live timing records and podium finishers from the last 3 meetings at North West Nitro.
            </p>
          </div>

          <button
            id="btn-view-all-results-home"
            onClick={() => onNavigate('results')}
            className="inline-flex items-center gap-2 text-sm font-racing font-bold text-lime-400 hover:text-lime-300 transition-colors cursor-pointer"
          >
            <span>Explore All Results & Lap Times</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Recent Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentResults.slice(0, 3).map((meeting, index) => {
            const nitroClass = meeting.classes.find(c => c.className === '1/8 Nitro Buggy');
            const nitroWinner = nitroClass?.finals[0]?.results[0];
            const ebuggyClass = meeting.classes.find(c => c.className === '1/8 E-Buggy');
            const ebuggyWinner = ebuggyClass?.finals[0]?.results[0];

            return (
              <div
                key={meeting.id}
                className="rounded-xl bg-neutral-900 border border-neutral-800 hover:border-lime-500/50 p-5 transition-all shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Meeting Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-lime-400 font-semibold">
                        {new Date(meeting.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <h3 className="font-racing font-bold text-base text-white tracking-wide mt-0.5 line-clamp-1">
                        {meeting.meetingName}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono text-[10px]">
                      Rd {index + 1}
                    </span>
                  </div>

                  {/* Podium Highlights */}
                  <div className="space-y-2.5 pt-2 border-t border-neutral-800 text-xs">
                    
                    {/* Nitro Winner */}
                    {nitroWinner && (
                      <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 space-y-1">
                        <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                          <span className="font-semibold text-neutral-300">1/8 Nitro Buggy A-Main</span>
                          <span className="text-yellow-400 font-bold flex items-center gap-1">
                            <Medal className="w-3.5 h-3.5" /> 1st Place
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-white text-sm">{nitroWinner.driverName}</span>
                          <span className="font-mono text-lime-400 text-[11px]">{nitroWinner.laps} Laps / {nitroWinner.time}</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono">Best Lap: {nitroWinner.bestLap}s</p>
                      </div>
                    )}

                    {/* E-Buggy Winner */}
                    {ebuggyWinner && (
                      <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 space-y-1">
                        <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                          <span className="font-semibold text-neutral-300">1/8 Electric Buggy A-Main</span>
                          <span className="text-yellow-400 font-bold flex items-center gap-1">
                            <Medal className="w-3.5 h-3.5" /> 1st Place
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-white text-sm">{ebuggyWinner.driverName}</span>
                          <span className="font-mono text-lime-400 text-[11px]">{ebuggyWinner.laps} Laps / {ebuggyWinner.time}</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono">Best Lap: {ebuggyWinner.bestLap}s</p>
                      </div>
                    )}

                  </div>

                </div>

                {/* View Meeting Link */}
                <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-mono text-[11px]">{meeting.summary.totalDrivers} Drivers Competed</span>
                  <button
                    onClick={() => onNavigate('results')}
                    className="text-lime-400 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Standings</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Member Discount Incentive Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-8 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-lime-400/20 text-lime-400 font-racing font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>North West Nitro Club Membership</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-racing font-bold text-white tracking-wide">
                Save £5 on Every Single Race Entry Fee
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Join our club community for the 2026 season! Members pay only <strong className="text-lime-400">£10</strong> per meeting (Standard fee is £15). Saving £5 on every race entry, your annual membership quickly pays for itself, plus you receive priority heat bookings, voting rights, and discounted open practice days.
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs text-neutral-400 pt-1">
                <div>• Adult Membership: <strong>£35/year</strong></div>
                <div>• Junior (Under 16): <strong>£25/year</strong></div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3 justify-center">
              {loggedInMember ? (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-2">
                  <p className="text-xs text-neutral-400">You are logged in as:</p>
                  <p className="font-racing font-bold text-lg text-lime-400">{loggedInMember.fullName}</p>
                  <p className="font-mono text-xs text-white">Member ID: {loggedInMember.membershipNumber}</p>
                  <p className="text-[11px] text-lime-400">Discount automatically applied to all bookings!</p>
                </div>
              ) : (
                <>
                  <button
                    id="btn-home-join-membership"
                    onClick={onOpenMembership}
                    className="w-full py-3 px-5 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold text-sm tracking-wider uppercase transition-all shadow-md cursor-pointer"
                  >
                    Join Club Membership
                  </button>
                  <button
                    id="btn-home-login-membership"
                    onClick={onOpenLogin}
                    className="w-full py-2.5 px-5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold text-center transition-all cursor-pointer"
                  >
                    Already a Member? Sign In
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Track & Facility Quick Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-racing font-bold text-white tracking-wide uppercase">
            Track & Facility Highlights
          </h2>
          <p className="text-sm text-neutral-400">
            Built by racers, for racers. Everything you need for an unforgettable race day in Lancashire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-lime-400/10 flex items-center justify-center text-lime-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-racing font-bold text-lg text-white">Off Road Circuit</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Technical, high-traction Off Road Circuit surface with elevated crossover jumps, berms, and tabletop jump sequences designed for consistent 1/8 racing.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-lime-400/10 flex items-center justify-center text-lime-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-racing font-bold text-lg text-white">AMB / MyLaps Timing</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Computerized timing loop with live race audio commentary, lap-by-lap timing analysis, and immediate upload to the official RC-Results venue portal.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-lime-400/10 flex items-center justify-center text-lime-400">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-racing font-bold text-lg text-white">Covered Rostrum & Pits</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Elevated high-visibility driver podium, undercover pit work areas, 240V generator power for battery chargers, air compressor cleaning, and hot catering van on site.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
