import React, { useState } from 'react';
import { 
  Calculator, 
  Target, 
  Layers, 
  CalendarClock, 
  GitCompare, 
  History, 
  BookOpen, 
  Scale, 
  Share2, 
  Printer, 
  Bookmark, 
  Menu, 
  X,
  Cpu,
  PiggyBank,
  RotateCcw,
  Check
} from 'lucide-react';
import { ActiveTabType, CalculationInputs } from '../types/mp2';
import { generateShareableUrl } from '../lib/exportUtils';

interface NavbarProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  currentInputs: CalculationInputs;
  onReset: () => void;
  onOpenSaved: () => void;
  onExport: () => void;
}

export const NAV_ITEMS: { id: ActiveTabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'goal', label: 'Goal Planner', icon: Target },
  { id: 'scenarios', label: 'Scenarios & What-If', icon: GitCompare },
  { id: 'inflation', label: 'Inflation Analysis', icon: Scale },
  { id: 'ladder', label: 'MP2 Ladder', icon: Layers },
  { id: 'strategies', label: 'Strategies & Timing', icon: CalendarClock },
  { id: 'historical', label: 'Historical Rates', icon: History },
  { id: 'compare', label: 'Compare Alternatives', icon: PiggyBank },
  { id: 'montecarlo', label: 'Monte Carlo', icon: Cpu },
  { id: 'methodology', label: 'Methodology & FAQ', icon: BookOpen },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentInputs,
  onReset,
  onOpenSaved,
  onExport,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleNavClick = (id: ActiveTabType) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    const shareUrl = generateShareableUrl(currentInputs);
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {
        // Fallback
        window.prompt('Copy your customized MP2 plan link:', shareUrl);
      }
    } else {
      window.prompt('Copy your customized MP2 plan link:', shareUrl);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#123B63] text-white shadow-md no-print">
      {/* Top Banner / Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => handleNavClick('calculator')}
          >
            {/* Official seal-like badge */}
            <div className="w-10 h-10 rounded-lg bg-[#0B5CAB] border border-blue-400/40 flex items-center justify-center shadow-sm shrink-0">
              <span className="text-white font-bold text-sm tracking-tight font-mono-num">
                MP2
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-white">
                  MP2 Savings Calculator
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-900/60 text-blue-100 border border-blue-400/30">
                  Republic of the Philippines
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-blue-100/80 font-normal">
                Pag-IBIG Fund Voluntary Savings • Official AMB Calculation Engine
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            
            {/* Save Scenarios button */}
            <button
              onClick={onOpenSaved}
              title="Saved Scenarios"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#155E9E] hover:bg-[#1b6cb3] text-white border border-blue-400/30 transition shadow-sm cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">Saved Plans</span>
            </button>

            {/* Share Scenario link */}
            <button
              onClick={handleShare}
              title="Copy shareable link"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#155E9E] hover:bg-[#1b6cb3] text-white border border-blue-400/30 transition shadow-sm cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-300 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-blue-200" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            {/* Print / Export PDF Report */}
            <button
              onClick={onExport}
              title="Print or export report"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-100 text-[#123B63] transition shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#123B63]" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-white hover:bg-[#155E9E] transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Primary Sub-Navigation Bar (Desktop Horizontal Tabs) */}
      <nav className="hidden lg:block bg-white border-b border-[#D9E3EC] px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#EAF3FA] text-[#0B5CAB] font-semibold border border-blue-200 shadow-xs'
                    : 'text-[#526575] hover:text-[#172B3A] hover:bg-[#F5F9FC]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0B5CAB]' : 'text-[#526575]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white text-[#172B3A] border-b border-[#D9E3EC] px-4 py-3 space-y-1 shadow-md">
          <div className="grid grid-cols-2 gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2.5 text-xs font-medium rounded-lg transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#EAF3FA] text-[#0B5CAB] font-semibold border border-blue-200'
                      : 'text-[#526575] hover:bg-[#F5F9FC] hover:text-[#172B3A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0B5CAB]' : 'text-[#526575]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
