import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Coins, 
  CreditCard, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Car, 
  Radio, 
  Loader2,
  Receipt
} from 'lucide-react';
import { RaceEvent, Member, RaceClass, EventEntry } from '../types';
import { createEntry, verifyMember } from '../lib/api';

interface EventBookingModalProps {
  event: RaceEvent | null;
  loggedInMember: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (entry: EventEntry) => void;
}

export const EventBookingModal: React.FC<EventBookingModalProps> = ({
  event,
  loggedInMember,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !event) return null;

  const [driverName, setDriverName] = useState(loggedInMember ? loggedInMember.fullName : '');
  const [email, setEmail] = useState(loggedInMember ? loggedInMember.email : '');
  const [phone, setPhone] = useState(loggedInMember ? loggedInMember.phone : '');
  const [brcaNumber, setBrcaNumber] = useState(loggedInMember ? loggedInMember.brcaNumber : '');
  const [transponderNumber, setTransponderNumber] = useState('');
  const [loanTransponder, setLoanTransponder] = useState(false);
  const [carClass, setCarClass] = useState<RaceClass>(event.classes[0] || '1/8 Nitro Buggy');
  const [notes, setNotes] = useState('');
  
  // Membership check & discount
  const [membershipNumberInput, setMembershipNumberInput] = useState(loggedInMember?.membershipNumber || '');
  const [isMemberVerified, setIsMemberVerified] = useState(!!loggedInMember);
  const [verifiedMemberObj, setVerifiedMemberObj] = useState<Member | null>(loggedInMember);
  const [verifyingMember, setVerifyingMember] = useState(false);
  const [memberVerificationError, setMemberVerificationError] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedEntry, setConfirmedEntry] = useState<EventEntry | null>(null);

  // Online card mock state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  useEffect(() => {
    if (loggedInMember) {
      setDriverName(loggedInMember.fullName);
      setEmail(loggedInMember.email);
      setPhone(loggedInMember.phone);
      setBrcaNumber(loggedInMember.brcaNumber);
      setMembershipNumberInput(loggedInMember.membershipNumber || '');
      setIsMemberVerified(true);
      setVerifiedMemberObj(loggedInMember);
    }
  }, [loggedInMember]);

  const handleVerifyMembershipNumber = async () => {
    if (!membershipNumberInput.trim()) {
      setMemberVerificationError('Please enter a membership number');
      return;
    }
    setVerifyingMember(true);
    setMemberVerificationError('');
    try {
      const res = await verifyMember(membershipNumberInput.trim());
      if (res.valid && res.member) {
        setIsMemberVerified(true);
        setVerifiedMemberObj(res.member);
        if (!driverName) setDriverName(res.member.fullName);
        if (!email) setEmail(res.member.email);
        if (!phone) setPhone(res.member.phone);
        if (!brcaNumber) setBrcaNumber(res.member.brcaNumber);
      } else {
        setIsMemberVerified(false);
        setVerifiedMemberObj(null);
        setMemberVerificationError('Membership number not found or expired. You can still enter with standard fee!');
      }
    } catch {
      setMemberVerificationError('Unable to verify membership number');
    } finally {
      setVerifyingMember(false);
    }
  };

  const currentFee = isMemberVerified ? event.memberFee : event.standardFee;
  const discountAmount = event.standardFee - event.memberFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!driverName.trim()) {
      setError('Driver full name is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid email address is required for entry confirmation');
      return;
    }
    if (!brcaNumber.trim()) {
      setError('BRCA license number is required for insurance at the track');
      return;
    }

    setSubmitting(true);
    try {
      const transponderVal = loanTransponder ? 'CLUB-LOAN-REQ' : (transponderNumber.trim() || 'TBA');
      const entry = await createEntry(event.id, {
        driverName: driverName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        brcaNumber: brcaNumber.trim().toUpperCase(),
        transponderNumber: transponderVal,
        carClass,
        paymentMethod,
        membershipNumber: isMemberVerified ? (verifiedMemberObj?.membershipNumber || membershipNumberInput.trim()) : undefined,
        notes: notes.trim() || undefined,
      });

      setConfirmedEntry(entry);
      onSuccess(entry);
    } catch (err: any) {
      setError(err.message || 'Failed to submit race entry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="font-racing font-bold text-xs uppercase tracking-wider text-lime-400">
                Official Race Entry
              </span>
            </div>
            <h2 className="text-xl font-racing font-bold text-white tracking-wide mt-0.5">
              {event.title}
            </h2>
            <p className="text-xs text-neutral-400">
              {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • Gates {event.gatesOpen}
            </p>
          </div>

          <button
            id="btn-close-booking-modal"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {confirmedEntry ? (
          /* Confirmation Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-lime-400/20 text-lime-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-racing font-bold text-white uppercase tracking-wide">
                Grid Position Reserved!
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto">
                Thank you, <strong className="text-white">{confirmedEntry.driverName}</strong>. Your race booking has been confirmed for <strong>{event.title}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-neutral-400 pb-2 border-b border-neutral-800">
                <span>Entry Booking Ref:</span>
                <span className="font-mono font-bold text-white">{confirmedEntry.id}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Class:</span>
                <span className="font-semibold text-lime-400">{confirmedEntry.carClass}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>BRCA License:</span>
                <span className="font-mono text-white">{confirmedEntry.brcaNumber}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Transponder:</span>
                <span className="font-mono text-white">{confirmedEntry.transponderNumber}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Payment Method:</span>
                <span className="font-semibold capitalize text-white">
                  {confirmedEntry.paymentMethod === 'cash' ? 'Cash on Race Morning' : 'Paid Online'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-300 pt-2 border-t border-neutral-800 text-sm">
                <span>Fee Total:</span>
                <span className="font-bold text-lime-400">
                  £{confirmedEntry.feeCharged}.00 {confirmedEntry.isMember ? '(Member Discount Applied)' : ''}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-400 max-w-md mx-auto text-left">
              <p className="font-semibold text-white mb-1">Important Race Morning Reminder:</p>
              <p>• Gates open at {event.gatesOpen}. Drivers briefing at {event.driversBriefing}.</p>
              {confirmedEntry.paymentMethod === 'cash' && (
                <p className="text-amber-400 mt-1">• Please pay £{confirmedEntry.feeCharged}.00 cash at Race Control before 08:30 booking close.</p>
              )}
            </div>

            <button
              id="btn-done-booking"
              onClick={onClose}
              className="px-8 py-3 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold text-sm tracking-wider uppercase cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        ) : (
          /* Entry Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Membership & Discount Section */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-racing font-bold uppercase text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-lime-400" />
                  NWN Club Member Discount (£5 Off)
                </span>
                {isMemberVerified ? (
                  <span className="px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 font-bold text-[11px] border border-lime-400/30">
                    £5 Discount Verified!
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-400">Standard £15 / Member £10</span>
                )}
              </div>

              {isMemberVerified ? (
                <div className="flex items-center justify-between text-xs text-neutral-300 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                  <div>
                    <p className="font-semibold text-white">Active Member: {verifiedMemberObj?.fullName || driverName}</p>
                    <p className="text-neutral-400 font-mono text-[11px]">Member ID: {verifiedMemberObj?.membershipNumber || membershipNumberInput}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMemberVerified(false);
                      setVerifiedMemberObj(null);
                    }}
                    className="text-neutral-400 hover:text-white text-[11px] underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="input-member-number"
                      value={membershipNumberInput}
                      onChange={(e) => setMembershipNumberInput(e.target.value)}
                      placeholder="Enter Membership # (e.g. NWN-014)"
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400"
                    />
                    <button
                      type="button"
                      id="btn-verify-member"
                      onClick={handleVerifyMembershipNumber}
                      disabled={verifyingMember}
                      className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {verifyingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Discount'}
                    </button>
                  </div>
                  {memberVerificationError && (
                    <p className="text-[11px] text-amber-400">{memberVerificationError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Driver Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-racing font-bold uppercase tracking-wider text-neutral-400">
                1. Driver Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">
                    Driver Full Name *
                  </label>
                  <input
                    type="text"
                    id="input-driver-name"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Mark Jenkins"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">
                    Email Address (For Confirmation) *
                  </label>
                  <input
                    type="email"
                    id="input-driver-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@example.com"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="input-driver-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07xxx xxx xxx"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1 flex items-center justify-between">
                    <span>BRCA License Number *</span>
                    <span className="text-[10px] text-neutral-500">Track Insurance</span>
                  </label>
                  <input
                    type="text"
                    id="input-driver-brca"
                    required
                    value={brcaNumber}
                    onChange={(e) => setBrcaNumber(e.target.value)}
                    placeholder="e.g. BRCA-41092"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-lime-400"
                  />
                </div>
              </div>
            </div>

            {/* Race Class & Transponder */}
            <div className="space-y-4">
              <h3 className="text-xs font-racing font-bold uppercase tracking-wider text-neutral-400">
                2. Racing Class & Transponder
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">
                    Select Race Class *
                  </label>
                  <select
                    id="select-car-class"
                    value={carClass}
                    onChange={(e) => setCarClass(e.target.value as RaceClass)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                  >
                    {event.classes.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1 flex items-center justify-between">
                    <span>Transponder Number</span>
                    <button
                      type="button"
                      onClick={() => setLoanTransponder(!loanTransponder)}
                      className="text-[11px] text-lime-400 hover:underline"
                    >
                      {loanTransponder ? 'I have my own transponder' : 'Need club loan?'}
                    </button>
                  </label>
                  {loanTransponder ? (
                    <div className="w-full bg-neutral-950 border border-lime-500/40 rounded-lg px-3 py-2 text-xs text-lime-400 flex items-center gap-2">
                      <Radio className="w-4 h-4" />
                      <span>Club loan transponder requested (£5 hire at desk)</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      id="input-transponder"
                      value={transponderNumber}
                      onChange={(e) => setTransponderNumber(e.target.value)}
                      placeholder="e.g. 7284910 (or TBA)"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-lime-400"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Choice (User Requirement: Cash on the day + Online payment ready) */}
            <div className="space-y-3">
              <h3 className="text-xs font-racing font-bold uppercase tracking-wider text-neutral-400">
                3. Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Cash on the day */}
                <button
                  type="button"
                  id="btn-pay-cash"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'bg-lime-500/10 border-lime-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Coins className={`w-5 h-5 flex-shrink-0 mt-0.5 ${paymentMethod === 'cash' ? 'text-lime-400' : 'text-neutral-500'}`} />
                  <div>
                    <p className="font-racing font-bold text-sm text-white">Pay Cash on the Day</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Pay at Race Control on Sunday morning before 08:30 booking close.
                    </p>
                  </div>
                </button>

                {/* Online Payment */}
                <button
                  type="button"
                  id="btn-pay-online"
                  onClick={() => setPaymentMethod('online')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'online'
                      ? 'bg-lime-500/10 border-lime-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 flex-shrink-0 mt-0.5 ${paymentMethod === 'online' ? 'text-lime-400' : 'text-neutral-500'}`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-racing font-bold text-sm text-white">Pay Online (Card)</p>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-400/20 text-lime-400 font-semibold">Ready</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Secure payment with instant confirmation receipt.
                    </p>
                  </div>
                </button>

              </div>

              {/* Online Payment Fields Preview if Online chosen */}
              {paymentMethod === 'online' && (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Card Checkout Simulator</span>
                    <span className="text-lime-400">Stripe Gateway Ready</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card number"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fee Summary */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400">Total Entry Fee:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-racing font-extrabold text-lime-400">
                    £{currentFee}.00
                  </span>
                  {isMemberVerified && (
                    <span className="text-xs text-emerald-400 font-semibold">
                      (Saved £{discountAmount}.00 with Membership)
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-booking"
                disabled={submitting}
                className="px-6 py-3 rounded-lg bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-neutral-950 font-racing font-bold text-sm uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <span>
                    {paymentMethod === 'cash' ? `Confirm Entry (Pay £${currentFee} Cash)` : `Pay £${currentFee}.00 & Enter`}
                  </span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
