import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Menu, 
  X, 
  CheckCircle, 
  LogOut, 
  LogIn, 
  Flag,
  Sparkles
} from 'lucide-react';
import { Member } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  loggedInMember: Member | null;
  onLogoutMember: () => void;
  onOpenLoginModal: () => void;
  onOpenQuickBookModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  loggedInMember,
  onLogoutMember,
  onOpenLoginModal,
  onOpenQuickBookModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Flag },
    { id: 'events', label: 'Race Calendar', icon: Calendar },
    { id: 'results', label: 'Results', icon: Trophy },
    { id: 'membership', label: 'Membership', icon: Users },
    { id: 'track', label: 'Track & Info', icon: MapPin },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck },
  ];

  const handleNavClick = (id: string) => {
    setCurrentView(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 transition-colors">
      {/* Top micro-bar with club status */}
      <div className="bg-neutral-900 border-b border-neutral-800/80 px-4 py-1 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="font-semibold text-neutral-300">NORTH WEST NITRO RC RACING</span>
          </div>

          <div className="flex items-center gap-3">
            {loggedInMember ? (
              <div className="flex items-center gap-2 bg-lime-500/10 border border-lime-500/30 px-2 py-0.5 rounded text-lime-400 font-mono text-[11px]">
                <CheckCircle className="w-3.5 h-3.5 text-lime-400" />
                <span>Member: <strong className="text-white">{loggedInMember.membershipNumber || 'Member'}</strong> (£5 Discount Active)</span>
                <button
                  id="btn-logout-member"
                  onClick={onLogoutMember}
                  title="Sign out"
                  className="ml-1 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                id="btn-member-login-nav"
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 text-neutral-300 hover:text-lime-400 cursor-pointer font-medium"
              >
                <LogIn className="w-3.5 h-3.5 text-lime-400" />
                <span>Member Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center group cursor-pointer focus:outline-none py-1"
            aria-label="North West Nitro - Home"
          >
            <img
              src="/logo.jpg"
              alt="North West Nitro"
              className="h-14 sm:h-16 w-auto max-h-16 object-contain rounded-lg shadow-md group-hover:brightness-110 group-hover:scale-105 transition-all duration-200 mix-blend-screen"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-lime-400 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="btn-nav-book-race"
              onClick={onOpenQuickBookModal}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-gradient-to-r from-lime-400 to-lime-500 text-neutral-950 font-racing font-bold tracking-wider uppercase text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-lime-400/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-neutral-950" />
              <span>Book Race Entry</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="btn-nav-book-race-mobile"
              onClick={onOpenQuickBookModal}
              className="px-3 py-1.5 rounded bg-lime-400 text-neutral-950 font-racing font-bold text-xs uppercase"
            >
              Book
            </button>
            <button
              id="btn-toggle-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-900 border-b border-neutral-800 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-mobile-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-lime-400 text-neutral-950 font-bold'
                    : 'text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
            {loggedInMember ? (
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-xs text-neutral-300 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lime-400">{loggedInMember.fullName}</p>
                  <p className="font-mono text-neutral-400">Card #{loggedInMember.membershipNumber}</p>
                </div>
                <button
                  onClick={onLogoutMember}
                  className="px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
                className="w-full py-2.5 px-4 bg-neutral-800 text-neutral-200 hover:text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-lime-400" />
                <span>Member Login (Get £5 Discount)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
