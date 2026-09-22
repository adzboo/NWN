import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  LogIn, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CreditCard,
  QrCode,
  Calendar,
  LogOut
} from 'lucide-react';
import { Member, MembershipTier, RaceClass } from '../types';
import { registerMember, verifyMember } from '../lib/api';

interface MembershipViewProps {
  loggedInMember: Member | null;
  onLoginMember: (member: Member) => void;
  onLogoutMember: () => void;
  onNavigateToCalendar: () => void;
}

export const MembershipView: React.FC<MembershipViewProps> = ({
  loggedInMember,
  onLoginMember,
  onLogoutMember,
  onNavigateToCalendar,
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'card'>('register');

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [brcaNumber, setBrcaNumber] = useState('');
  const [primaryClass, setPrimaryClass] = useState<RaceClass>('1/8 Nitro Buggy');
  const [membershipType, setMembershipType] = useState<MembershipTier>('Adult');
  const [rulesAgreed, setRulesAgreed] = useState(false);

  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState<Member | null>(null);
  const [registerError, setRegisterError] = useState('');

  // Login State
  const [loginQuery, setLoginQuery] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!rulesAgreed) {
      setRegisterError('Please agree to club and BRCA track safety rules');
      return;
    }

    setRegistering(true);
    try {
      const member = await registerMember({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        postcode: postcode.trim().toUpperCase(),
        emergencyContactName: emergencyName.trim(),
        emergencyContactPhone: emergencyPhone.trim(),
        brcaNumber: brcaNumber.trim().toUpperCase(),
        primaryClass,
        membershipType,
      });
      setRegisterSuccess(member);
    } catch (err: any) {
      setRegisterError(err.message || 'Failed to submit membership application');
    } finally {
      setRegistering(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginQuery.trim()) {
      setLoginError('Please enter your email address or Membership ID');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await verifyMember(loginQuery.trim());
      if (res.valid && res.member) {
        onLoginMember(res.member);
        setActiveTab('card');
      } else {
        setLoginError('No active member found with that email or membership number. (Tip: Try demo number NWN-001 or NWN-014)');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error checking membership');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider font-racing">
          <Award className="w-4 h-4" />
          <span>North West Nitro 2026 Club Membership</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-racing font-bold text-white tracking-wide uppercase mt-1">
          Join the Club & Get Member Race Discounts
        </h1>
        <p className="text-sm text-neutral-400 max-w-3xl mt-1">
          Official membership for the North West Nitro 1/8 Off-Road RC Club in Blackpool. Every member receives a £5.00 discount on race fees at every round, priority entry, and discounted practice days.
        </p>
      </div>

      {/* Benefits & Perks Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-neutral-900 border border-lime-500/30 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-lime-400/5 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-racing font-bold text-lg text-white">Save £5 on Every Race</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Members pay just <strong className="text-lime-400">£10</strong> per meeting instead of the £15 standard entry. Attend 7 meetings as an adult (or 5 as a junior) and your annual membership is completely paid for!
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-racing font-bold text-lg text-white">Practice Day Privileges</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Get 50% off all official track practice and setup testing days (£5 for members vs £10 non-members), plus priority grid registration for championship rounds.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-racing font-bold text-lg text-white">Club Voice & Governance</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Full voting rights at the North West Nitro Annual General Meeting (AGM), eligibility for end-of-season championship trophies, and official club lanyard & badge.
          </p>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 gap-4">
        <button
          id="tab-btn-register"
          onClick={() => setActiveTab('register')}
          className={`pb-3 text-sm font-racing font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'register'
              ? 'text-lime-400 border-b-2 border-lime-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          1. Apply for Membership
        </button>
        <button
          id="tab-btn-card"
          onClick={() => setActiveTab('card')}
          className={`pb-3 text-sm font-racing font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'card'
              ? 'text-lime-400 border-b-2 border-lime-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          2. Member Sign In & Digital Card
        </button>
      </div>

      {/* Tab 1: Registration Form */}
      {activeTab === 'register' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form */}
          <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            {registerSuccess ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-lime-400/20 text-lime-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-racing font-bold text-white uppercase">
                    Membership Application Received!
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{registerSuccess.fullName}</strong>. Your membership request has been submitted to the North West Nitro committee.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left text-xs max-w-md mx-auto space-y-2">
                  <div className="flex justify-between text-neutral-400">
                    <span>Application ID:</span>
                    <span className="font-mono text-white font-bold">{registerSuccess.id}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Status:</span>
                    <span className="text-amber-400 font-bold uppercase">Pending Admin Allocation</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Annual Fee:</span>
                    <span className="text-lime-400 font-bold">
                      {registerSuccess.membershipType === 'Junior (Under 16)' ? '£25.00' : '£35.00'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-800">
                    A committee official will manually assign your official membership number (e.g. <strong>NWN-042</strong>) in the backend portal.
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setRegisterSuccess(null);
                      setActiveTab('card');
                    }}
                    className="px-6 py-2.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold text-xs uppercase cursor-pointer"
                  >
                    Go to Member Sign In
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                
                {registerError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{registerError}</span>
                  </div>
                )}

                {/* Membership Tier Select */}
                <div className="space-y-3">
                  <label className="block text-xs font-racing font-bold uppercase tracking-wider text-neutral-400">
                    Select Membership Category *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setMembershipType('Adult')}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        membershipType === 'Adult' || (membershipType as string) === 'Senior'
                          ? 'bg-lime-500/10 border-lime-400 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <span className="font-racing font-bold text-sm text-white block">Adult</span>
                      <span className="text-xl font-racing font-extrabold text-lime-400 block mt-1">£35.00</span>
                      <span className="text-[11px] text-neutral-400 block">Adult drivers (16+)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMembershipType('Junior (Under 16)')}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        membershipType === 'Junior (Under 16)'
                          ? 'bg-lime-500/10 border-lime-400 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <span className="font-racing font-bold text-sm text-white block">Junior</span>
                      <span className="text-xl font-racing font-extrabold text-lime-400 block mt-1">£25.00</span>
                      <span className="text-[11px] text-neutral-400 block">Under 16 years old</span>
                    </button>

                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-racing font-bold uppercase tracking-wider text-neutral-400">
                    Personal & Contact Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-300 font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        id="input-member-fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Driver Name"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 font-medium mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        id="input-member-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 font-medium mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        id="input-member-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07xxx xxx xxx"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 font-medium mb-1">BRCA License Number *</label>
                      <input
                        type="text"
                        required
                        id="input-member-brca"
                        value={brcaNumber}
                        onChange={(e) => setBrcaNumber(e.target.value)}
                        placeholder="BRCA-12345"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white uppercase focus:outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-neutral-300 font-medium mb-1">Address / Street</label>
                      <input
                        type="text"
                        id="input-member-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 font-medium mb-1">Postcode *</label>
                      <input
                        type="text"
                        required
                        id="input-member-postcode"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="e.g. FY4 4XN"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white uppercase focus:outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>

                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-xs font-racing font-bold uppercase tracking-wider text-neutral-400">
                    Emergency Contact (Track Safety Requirement)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-300 font-medium mb-1">Emergency Contact Name</label>
                      <input
                        type="text"
                        id="input-emergency-name"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins (Partner)"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 font-medium mb-1">Emergency Phone Number</label>
                      <input
                        type="tel"
                        id="input-emergency-phone"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="07xxx xxx xxx"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Class */}
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">Primary Racing Class</label>
                  <select
                    id="select-member-class"
                    value={primaryClass}
                    onChange={(e) => setPrimaryClass(e.target.value as RaceClass)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                  >
                    <option value="1/8 Nitro Buggy">1/8 Nitro Buggy</option>
                    <option value="1/8 E-Buggy">1/8 Electric Buggy (E-Buggy)</option>
                    <option value="1/8 Truggy">1/8 Truggy</option>
                  </select>
                </div>

                {/* Rules Checkbox */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs text-neutral-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="checkbox-rules-agreed"
                      required
                      checked={rulesAgreed}
                      onChange={(e) => setRulesAgreed(e.target.checked)}
                      className="mt-1 accent-lime-400 rounded cursor-pointer"
                    />
                    <span>
                      I agree to abide by the North West Nitro club constitution, track safety regulations, compulsory marshaling obligations, and BRCA code of conduct.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-neutral-400">
                    Payment collected via cash on first meeting or bank transfer.
                  </span>
                  <button
                    type="submit"
                    id="btn-submit-membership-app"
                    disabled={registering}
                    className="px-7 py-3 rounded-lg bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-neutral-950 font-racing font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {registering ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Membership Application</span>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h3 className="font-racing font-bold text-lg text-white uppercase">How It Works</h3>
              <ol className="text-xs text-neutral-300 space-y-3 list-decimal list-inside leading-relaxed">
                <li>Submit your registration details and BRCA number.</li>
                <li>The club committee will verify and <strong>manually allocate your official NWN membership number</strong> in the backend.</li>
                <li>Sign in anytime using your email or membership number.</li>
                <li>Your <strong>£5 race entry discount</strong> is automatically calculated at checkout for every meeting!</li>
              </ol>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-3">
              <p className="text-xs text-neutral-400">Already registered with North West Nitro?</p>
              <button
                onClick={() => setActiveTab('card')}
                className="w-full py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-racing font-bold text-xs uppercase transition-colors cursor-pointer"
              >
                Sign In to Member Portal
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Member Login & Digital Card */}
      {activeTab === 'card' && (
        <div className="max-w-2xl mx-auto space-y-8">
          
          {loggedInMember ? (
            /* Digital Membership Card */
            <div className="space-y-6">
              <div className="relative rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-lime-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden box-glow-lime">
                
                {/* Background watermarks */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -right-8 opacity-15 pointer-events-none w-48 h-48">
                  <img src="/logo.jpg" alt="" className="w-full h-full object-contain mix-blend-screen" />
                </div>

                <div className="relative z-10 space-y-6">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/logo.jpg" alt="NWN" className="w-12 h-12 rounded object-contain mix-blend-screen" />
                      <div>
                        <h2 className="font-racing font-extrabold text-lg tracking-wider text-lime-400 text-glow-lime">
                          NORTH WEST NITRO
                        </h2>
                        <p className="text-[10px] text-neutral-400 tracking-wider uppercase">Official Club Member Pass</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-lime-400 text-neutral-950 font-racing font-bold text-xs uppercase tracking-wider">
                      {loggedInMember.membershipType}
                    </span>
                  </div>

                  {/* Member Name & ID */}
                  <div className="space-y-1 pt-2">
                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Driver Name</p>
                    <p className="text-2xl sm:text-3xl font-racing font-bold text-white tracking-wide">
                      {loggedInMember.fullName}
                    </p>
                  </div>

                  {/* Card Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">Membership No.</span>
                      <strong className="font-mono text-base text-lime-400 font-bold">
                        {loggedInMember.membershipNumber || 'PENDING'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">BRCA License</span>
                      <strong className="font-mono text-sm text-neutral-200">
                        {loggedInMember.brcaNumber}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">Valid Through</span>
                      <strong className="font-mono text-sm text-neutral-200">
                        {loggedInMember.expiryDate}
                      </strong>
                    </div>
                  </div>

                  {/* Active Perks Banner inside card */}
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-lime-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-semibold">£5 Race Fee Discount Active</span>
                    </div>
                    <span className="font-mono text-[11px] text-neutral-400">NWN Venue #34</span>
                  </div>

                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  id="btn-card-enter-race"
                  onClick={onNavigateToCalendar}
                  className="px-6 py-3 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-racing font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>Book Race with Member Discount</span>
                </button>

                <button
                  id="btn-card-logout"
                  onClick={onLogoutMember}
                  className="px-5 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Member Profile</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Box */
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-lime-400/20 text-lime-400 mx-auto flex items-center justify-center">
                  <LogIn className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-racing font-bold text-white uppercase tracking-wide">
                  Member Sign In
                </h2>
                <p className="text-xs text-neutral-400">
                  Enter your email address or your NWN Membership ID (e.g. <strong>NWN-001</strong>, <strong>NWN-014</strong>, <strong>NWN-028</strong>) to activate member discounts.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">
                    Membership Number or Email *
                  </label>
                  <input
                    type="text"
                    id="input-member-login-query"
                    required
                    value={loginQuery}
                    onChange={(e) => setLoginQuery(e.target.value)}
                    placeholder="e.g. NWN-014 or mark.jenkins@nwnitro-racing.co.uk"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-submit-member-login"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-lg bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-neutral-950 font-racing font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                      <span>Checking member credentials...</span>
                    </>
                  ) : (
                    <span>Sign In & Activate £5 Discount</span>
                  )}
                </button>
              </form>

              {/* Demo credentials helper for testing */}
              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1.5">
                <span className="font-semibold text-white block">Pre-registered Active Members for Testing:</span>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setLoginQuery('NWN-001')}
                    className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-lime-400 hover:border-lime-400 cursor-pointer"
                  >
                    NWN-001 (Mark Jenkins)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginQuery('NWN-014')}
                    className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-lime-400 hover:border-lime-400 cursor-pointer"
                  >
                    NWN-014 (David Bradley)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginQuery('NWN-028')}
                    className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-lime-400 hover:border-lime-400 cursor-pointer"
                  >
                    NWN-028 (Liam Thompson)
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
