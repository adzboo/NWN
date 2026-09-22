import React, { useState } from 'react';
import { 
  Trophy, 
  ExternalLink, 
  RefreshCw, 
  Medal, 
  Clock, 
  Flag, 
  ChevronDown, 
  Sparkles,
  Search,
  CheckCircle2,
  TrendingUp,
  Download
} from 'lucide-react';
import { RCMeetingResult, RaceClass } from '../types';

interface ResultsViewProps {
  results: RCMeetingResult[];
  onImportNewMeeting?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  onImportNewMeeting,
}) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(results[0]?.id || '');
  const [selectedClass, setSelectedClass] = useState<string>('1/8 Nitro Buggy');
  const [selectedFinalIndex, setSelectedFinalIndex] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState('');

  const currentMeeting = results.find(r => r.id === selectedMeetingId) || results[0];

  if (!currentMeeting) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-400">
        <Trophy className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
        <h2 className="text-xl font-racing font-bold text-white uppercase">No Race Results Loaded</h2>
        <p className="text-xs text-neutral-500 mt-1">Please import results from RC-Results Venue #34 in the Admin Portal.</p>
      </div>
    );
  }

  // Find class and finals
  const classData = currentMeeting.classes.find(c => c.className === selectedClass) || currentMeeting.classes[0];
  const finalData = classData?.finals[selectedFinalIndex] || classData?.finals[0];

  const filteredDriverResults = finalData?.results.filter(d => 
    d.driverName.toLowerCase().includes(searchFilter.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider font-racing">
            <Trophy className="w-4 h-4" />
            <span>RC-Results Official Venue #34 Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-racing font-bold text-white tracking-wide uppercase mt-1">
            Race Results & Lap Records
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl mt-1">
            Official race meeting classifications, finals, lap times, and bump-ups synchronized from the North West Nitro AMB/MyLaps timing loop.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://rc-results.com/Viewer/Main/VenueMeetings?venueId=34"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-rc-results-external"
            className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>View Venue on RC-Results.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-lime-400" />
          </a>
        </div>
      </div>

      {/* Meeting Selector & Stats Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Meeting Dropdown Card */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-neutral-400 font-medium">Select Race Meeting:</span>
              <div className="relative mt-1">
                <select
                  id="select-meeting"
                  value={currentMeeting.id}
                  onChange={(e) => {
                    setSelectedMeetingId(e.target.value);
                    setSelectedFinalIndex(0);
                  }}
                  className="w-full sm:w-auto bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm font-racing font-bold text-white focus:outline-none focus:border-lime-400 cursor-pointer pr-10 appearance-none"
                >
                  {results.map((m) => (
                    <option key={m.id} value={m.id}>
                      {new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} — {m.meetingName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500">Date: </span>
                <strong className="text-white font-mono">{currentMeeting.date}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500">Venue: </span>
                <strong className="text-lime-400">NWN (ID 34)</strong>
              </div>
            </div>
          </div>

          {/* Quick Podium Winners Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {currentMeeting.summary.nitroBuggyWinner && (
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <span className="text-[10px] uppercase font-bold text-neutral-400">1/8 Nitro Winner</span>
                <p className="font-racing font-bold text-sm text-lime-400 mt-0.5">{currentMeeting.summary.nitroBuggyWinner}</p>
              </div>
            )}
            {currentMeeting.summary.eBuggyWinner && (
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <span className="text-[10px] uppercase font-bold text-neutral-400">1/8 E-Buggy Winner</span>
                <p className="font-racing font-bold text-sm text-lime-400 mt-0.5">{currentMeeting.summary.eBuggyWinner}</p>
              </div>
            )}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Total Competitors</span>
              <p className="font-racing font-bold text-sm text-white mt-0.5">{currentMeeting.summary.totalDrivers} Drivers</p>
            </div>
          </div>

        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-racing font-bold text-base text-white uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-lime-400" />
              Automated Timing System
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Race results are generated by our on-site AMB RC4 decoder. Points from each round contribute directly toward the 2026 North West Nitro Summer & Winter Championships.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400">
            <span>Official Timing Provider: </span>
            <span className="text-white font-semibold">RC-Results.com</span>
          </div>
        </div>

      </div>

      {/* Class & Finals Selector Tabs */}
      <div className="space-y-4">
        
        {/* Class Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {currentMeeting.classes.map((cls) => {
              const isSelected = cls.className === selectedClass;
              return (
                <button
                  key={cls.className}
                  onClick={() => {
                    setSelectedClass(cls.className);
                    setSelectedFinalIndex(0);
                  }}
                  className={`px-4 py-2 rounded-lg font-racing font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-lime-400 text-neutral-950 shadow-md'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  {cls.className}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search driver name..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>

        {/* Finals Tabs (A-Main, B-Main, etc.) */}
        {classData && classData.finals.length > 1 && (
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <span className="text-xs text-neutral-500 font-racing uppercase mr-2">Final Group:</span>
            {classData.finals.map((final, idx) => (
              <button
                key={final.finalName}
                onClick={() => setSelectedFinalIndex(idx)}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  selectedFinalIndex === idx
                    ? 'bg-neutral-800 text-lime-400 border border-lime-400/40'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {final.finalName} ({final.duration})
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Standings Table */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-lime-400" />
            <span className="font-racing font-bold text-sm text-white uppercase">
              {classData?.className} — {finalData?.finalName || 'Final'} ({finalData?.duration || '20:00'})
            </span>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {filteredDriverResults.length} Competitors Classified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 font-racing uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Pos</th>
                <th className="py-3 px-4 w-16 text-center">Car #</th>
                <th className="py-3 px-4">Driver Name</th>
                <th className="py-3 px-4 text-center">Laps</th>
                <th className="py-3 px-4">Total Time</th>
                <th className="py-3 px-4">Best Lap</th>
                <th className="py-3 px-4">Average Lap</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredDriverResults.map((driver) => {
                const isPodium = driver.position <= 3;
                let medalColor = 'text-neutral-400';
                if (driver.position === 1) medalColor = 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
                if (driver.position === 2) medalColor = 'text-slate-300 bg-slate-400/10 border-slate-400/30';
                if (driver.position === 3) medalColor = 'text-amber-500 bg-amber-500/10 border-amber-500/30';

                return (
                  <tr key={driver.position} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Position */}
                    <td className="py-3.5 px-4 text-center">
                      {isPodium ? (
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-racing font-bold text-xs border ${medalColor}`}>
                          {driver.position}
                        </span>
                      ) : (
                        <span className="font-mono text-neutral-500 font-bold">{driver.position}</span>
                      )}
                    </td>

                    {/* Car # */}
                    <td className="py-3.5 px-4 text-center font-mono text-neutral-400">
                      {driver.carNumber}
                    </td>

                    {/* Driver Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${driver.position === 1 ? 'text-lime-400 font-bold' : 'text-white'}`}>
                          {driver.driverName}
                        </span>
                        {driver.bumpUp && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                            Bumped Up
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Laps */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white text-sm">
                      {driver.laps}
                    </td>

                    {/* Total Time */}
                    <td className="py-3.5 px-4 font-mono text-neutral-300">
                      {driver.time}
                    </td>

                    {/* Best Lap */}
                    <td className="py-3.5 px-4 font-mono text-lime-400 font-medium">
                      {driver.bestLap}s
                    </td>

                    {/* Average Lap */}
                    <td className="py-3.5 px-4 font-mono text-neutral-400">
                      {driver.averageLap ? `${driver.averageLap}s` : '-'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-right">
                      {driver.position === 1 ? (
                        <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 font-bold text-[10px] uppercase">
                          Winner
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-[11px]">Finished</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
