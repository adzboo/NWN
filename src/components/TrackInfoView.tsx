import React from 'react';
import { MapPin, Clock, Fuel, Wrench, Shield, Coffee, Zap, Navigation, ExternalLink, Calendar } from 'lucide-react';

interface TrackInfoViewProps {
  onNavigateToCalendar: () => void;
  onNavigateToMembership: () => void;
}

export const TrackInfoView: React.FC<TrackInfoViewProps> = ({
  onNavigateToCalendar,
  onNavigateToMembership,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider font-racing">
          <MapPin className="w-4 h-4" />
          <span>North West Nitro Track Location & Venue Facilities</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-racing font-bold text-white tracking-wide uppercase mt-1">
          Blackpool Off-Road Race Circuit
        </h1>
        <p className="text-sm text-neutral-400 max-w-3xl mt-1">
          Purpose-built all-weather astro-turf circuit located on Mythop Road, Blackpool. Host venue for BRCA regional and national off-road championship rounds.
        </p>
      </div>

      {/* Hero Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Track Image */}
        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl relative group">
          <img
            src="/hero-race.jpg"
            alt="North West Nitro Track"
            className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-xs flex items-center justify-between">
            <div>
              <span className="font-racing font-bold text-white uppercase text-sm block">Astroturf All-Weather Surface</span>
              <span className="text-neutral-400">High-grip jumps, tabletop, banked berm, and washboard sections</span>
            </div>
            <span className="px-2.5 py-1 rounded bg-lime-400 text-neutral-950 font-racing font-bold uppercase text-[10px]">
              Venue 34
            </span>
          </div>
        </div>

        {/* Location & Directions Card */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-racing font-bold text-lime-400 uppercase">Venue Address</span>
            <h3 className="text-xl font-racing font-bold text-white uppercase">
              How to Find Us
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              North West Nitro RC Club<br />
              Mythop Road, Blackpool<br />
              Lancashire, FY4 4XN<br />
              United Kingdom
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Navigation className="w-4 h-4 text-lime-400" />
              <span>Sat Nav & Highway Access:</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Conveniently situated just 5 minutes off the M55 motorway (Junction 4). Follow the brown signs towards Mythop / Staining. Easy access for motorhomes, vans, and pit trailers.
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Mythop+Road+Blackpool+FY44XN"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-racing font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer border border-neutral-700"
          >
            <span>Open in Google Maps / Sat Nav</span>
            <ExternalLink className="w-3.5 h-3.5 text-lime-400" />
          </a>
        </div>

      </div>

      {/* Track Facilities Bento */}
      <div className="space-y-4">
        <h2 className="text-2xl font-racing font-bold text-white uppercase tracking-wide">
          Paddock & Track Facilities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-racing font-bold text-base text-white">Covered Rostrum</h4>
            <p className="text-xs text-neutral-400">
              Elevated, heavy-duty steel rostrum accommodating up to 14 drivers with full rain canopy and unhindered sightlines.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-racing font-bold text-base text-white">240V Pit Power</h4>
            <p className="text-xs text-neutral-400">
              Generator power stations across the pit paddock for battery charging, heat guns, and engine warmers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="font-racing font-bold text-base text-white">High-Pressure Air</h4>
            <p className="text-xs text-neutral-400">
              Dedicated air compressor station with blow guns to clean down buggies and truggies between heats.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <h4 className="font-racing font-bold text-base text-white">On-Site Catering</h4>
            <p className="text-xs text-neutral-400">
              Hot breakfast barm cakes, fresh burgers, tea, coffee, and cold refreshments served from 07:30 on race mornings.
            </p>
          </div>

        </div>
      </div>

      {/* Race Day Timetable */}
      <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
        <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider font-racing">
          <Clock className="w-4 h-4" />
          <span>Typical Sunday Race Schedule</span>
        </div>
        <h3 className="text-2xl font-racing font-bold text-white uppercase tracking-wide">
          Race Meeting Timetable
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="font-mono text-lime-400 font-bold text-base">07:30</span>
            <p className="font-bold text-white">Gates & Pits Open</p>
            <p className="text-neutral-500">Track open for un-timed sighting laps. Catering open.</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="font-mono text-lime-400 font-bold text-base">08:30</span>
            <p className="font-bold text-white">Booking & Cash Closes</p>
            <p className="text-neutral-500">All drivers must be signed in and cash paid at race control.</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="font-mono text-lime-400 font-bold text-base">08:45</span>
            <p className="font-bold text-white">Drivers Briefing</p>
            <p className="text-neutral-500">Compulsory briefing under the rostrum for all drivers.</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="font-mono text-lime-400 font-bold text-base">09:00</span>
            <p className="font-bold text-white">Round 1 Heats</p>
            <p className="text-neutral-500">3 rounds of qualifying followed by bump-up finals.</p>
          </div>

        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <button
            onClick={onNavigateToCalendar}
            className="px-6 py-3 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Check 2026 Race Calendar
          </button>
          <button
            onClick={onNavigateToMembership}
            className="px-6 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-racing font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Apply for Club Membership
          </button>
        </div>
      </div>

    </div>
  );
};
