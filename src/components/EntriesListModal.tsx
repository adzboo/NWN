import React, { useState, useEffect } from 'react';
import { X, Users, Loader2, Search, Filter, ShieldCheck, Car } from 'lucide-react';
import { RaceEvent, EventEntry, RaceClass } from '../types';
import { getEventEntries } from '../lib/api';

interface EntriesListModalProps {
  event: RaceEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EntriesListModal: React.FC<EntriesListModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const [entries, setEntries] = useState<EventEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const eventId = event?.id;

  useEffect(() => {
    if (!isOpen || !eventId) return;
    async function load() {
      setLoading(true);
      try {
        const data = await getEventEntries(eventId!);
        setEntries(data);
      } catch (err) {
        console.error('Failed to load entries:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isOpen, eventId]);

  if (!isOpen || !event) return null;

  const filteredEntries = entries.filter((e) => {
    const matchClass = selectedClass === 'all' || e.carClass === selectedClass;
    const matchSearch = e.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.brcaNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-lime-400" />
              <span className="font-racing font-bold text-xs uppercase tracking-wider text-lime-400">
                Driver Entry List
              </span>
            </div>
            <h2 className="text-xl font-racing font-bold text-white tracking-wide mt-0.5">
              {event.title}
            </h2>
            <p className="text-xs text-neutral-400">
              {entries.length} drivers booked across {event.classes.join(', ')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedClass('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedClass === 'all' ? 'bg-lime-400 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              All Classes ({entries.length})
            </button>
            {event.classes.map((c) => {
              const count = entries.filter((e) => e.carClass === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedClass(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    selectedClass === c ? 'bg-lime-400 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {c} ({count})
                </button>
              );
            })}
          </div>

          <div className="w-full sm:w-60 relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver or BRCA..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>

        {/* Driver List Table */}
        <div className="max-h-[460px] overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-lime-400 mb-2" />
              <span>Loading entered drivers...</span>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-12 text-center text-neutral-400 text-xs">
              No entries found matching criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 font-racing uppercase tracking-wider sticky top-0 border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Driver Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">BRCA No.</th>
                  <th className="py-3 px-4">Transponder</th>
                  <th className="py-3 px-4 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredEntries.map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-mono text-neutral-500">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{entry.driverName}</span>
                        {entry.isMember && (
                          <span className="px-1.5 py-0.2 rounded bg-lime-400/20 text-lime-400 font-mono text-[10px] font-bold">
                            {entry.membershipNumber || 'MEMBER'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[11px]">
                        {entry.carClass}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-400">{entry.brcaNumber}</td>
                    <td className="py-3 px-4 font-mono text-neutral-400">
                      {entry.transponderNumber === 'CLUB-LOAN-REQ' ? (
                        <span className="text-amber-400 font-sans text-[11px]">Club Loan Req</span>
                      ) : (
                        entry.transponderNumber
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        entry.paymentStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {entry.paymentStatus === 'paid' ? 'Paid' : 'Cash on Day'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-neutral-950 border-t border-neutral-800 px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
