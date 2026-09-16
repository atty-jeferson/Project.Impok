import React, { useState, useEffect } from 'react';
import { 
  CalculationInputs, 
  CalculationResults, 
  ActiveTabType,
  AppMode
} from './types/mp2';
import { calculateMp2Projection, DEFAULT_CALCULATION_INPUTS } from './lib/mp2Calculator';
import { loadInputsFromUrl } from './lib/exportUtils';
import { 
  getSavedScenarios, 
  getLatestScenario,
  getAppMode,
  setAppMode,
  getUserNickname,
  setUserNickname
} from './lib/storage';

// Navigation & Layout
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { LandingPage } from './components/LandingPage';

// Planning Components
import { CoreCalculator } from './components/CoreCalculator';
import { ResultsDashboard } from './components/ResultsDashboard';
import { InteractiveGrowthChart } from './components/InteractiveGrowthChart';
import { YearByYearTable } from './components/YearByYearTable';
import { GoalPlanner } from './components/GoalPlanner';
import { ContributionPlanner } from './components/ContributionPlanner';
import { Mp2Ladder } from './components/Mp2Ladder';

// Analysis Components & Coach Tools
import { WhatIfView } from './components/WhatIfView';
import { InflationAnalysis } from './components/InflationAnalysis';
import { HistoricalTracker } from './components/HistoricalTracker';
import { FacilitatorModeView } from './components/FacilitatorModeView';

// Advanced Components
import { SensitivityMatrix } from './components/SensitivityMatrix';
import { MonteCarloSimulation } from './components/MonteCarloSimulation';
import { CompareAlternatives } from './components/CompareAlternatives';

// Educational & Utility Components
import { Mp2In3Minutes } from './components/Mp2In3Minutes';
import { HowItWorksView } from './components/HowItWorksView';
import { MethodologyFaq } from './components/MethodologyFaq';
import { SourcesAssumptionsView } from './components/SourcesAssumptionsView';
import { SavedScenariosModal } from './components/SavedScenariosModal';
import { SettingsView } from './components/SettingsView';

// Icons
import {
  Menu,
  Bookmark,
  Share2,
  Printer,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  User,
  Edit2,
  X,
  Sparkles,
  Layers,
  Sprout
} from 'lucide-react';

export default function App() {
  // Navigation tab state - default to 'landing' for welcoming introduction
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('project_impok_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Navigation tab state - default to 'landing' for welcoming introduction
  const [activeTab, setActiveTab] = useState<ActiveTabType>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam) return tabParam as ActiveTabType;
      if (urlParams.get('m') || urlParams.get('init')) return 'calculator';
      const hasVisited = localStorage.getItem('project_impok_has_visited');
      if (hasVisited === 'true') return 'dashboard';
    } catch {
      // ignore
    }
    return 'landing';
  });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'landing') {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated, activeTab]);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // App Mode (Quick Mode vs Advanced Mode)
  const [appMode, setAppModeState] = useState<AppMode>(() => getAppMode());

  // User Profile Nickname
  const [userNickname, setUserNicknameState] = useState<string>(() => getUserNickname());
  const [isEditingNickname, setIsEditingNickname] = useState<boolean>(false);
  const [nicknameInput, setNicknameInput] = useState<string>(userNickname);

  // Desktop Sidebar collapsed state with localStorage persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('project_impok_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('project_impok_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Core Inputs state, initialized from URL params if present, or last saved, or default
  const [inputs, setInputs] = useState<CalculationInputs>(() => {
    const fromUrl = loadInputsFromUrl();
    if (fromUrl) return fromUrl;
    const fromStorage = getLatestScenario();
    if (fromStorage) return fromStorage.inputs;
    return DEFAULT_CALCULATION_INPUTS;
  });

  // Keep saved count updated
  useEffect(() => {
    const scenarios = getSavedScenarios();
    setSavedCount(scenarios.length);
  }, [isSavedModalOpen]);

  // Toggle App Mode handler
  const handleToggleMode = (mode: AppMode) => {
    setAppModeState(mode);
    setAppMode(mode);
  };

  // Save Nickname handler
  const handleSaveNickname = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = nicknameInput.trim() || 'Ka-Ipon';
    setUserNicknameState(clean);
    setUserNickname(clean);
    setIsEditingNickname(false);
  };

  // Calculate live results based on current inputs using single authoritative engine
  const results: CalculationResults = calculateMp2Projection(inputs);

  // Input change handler
  const handleInputChange = (updated: Partial<CalculationInputs>) => {
    setInputs(prev => ({
      ...prev,
      ...updated,
    }));
  };

  // Reset to clean defaults
  const handleReset = () => {
    setInputs(DEFAULT_CALCULATION_INPUTS);
  };

  // Share link handler
  const handleShare = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('init', String(inputs.startingAmount));
    currentUrl.searchParams.set('m', String(inputs.monthlyContribution));
    currentUrl.searchParams.set('r', String(inputs.assumedDividendRate));
    currentUrl.searchParams.set('y', String(inputs.projectionYears));
    currentUrl.searchParams.set('opt', inputs.dividendTreatment);

    navigator.clipboard.writeText(currentUrl.toString()).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    });
  };

  // Export / Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Section title mapping for top bar breadcrumbs
  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return { section: 'HOME', title: 'Dashboard' };
      case 'calculator':
        return { section: 'MY PLAN', title: 'My MP2 Projection' };
      case 'goal':
        return { section: 'MY PLAN', title: 'My Savings Goal' };
      case 'strategies':
        return { section: 'MY PLAN', title: 'Ways to Save (Strategies)' };
      case 'ladder':
        return { section: 'EXPLORE', title: 'MP2 Ladder (5-Yr Cycles)' };
      case 'scenarios':
        return { section: 'EXPLORE', title: 'What If? (Scenario Simulator)' };
      case 'inflation':
        return { section: 'EXPLORE', title: 'Inflation & Purchasing Power' };
      case 'literacy':
        return { section: 'LEARN', title: 'MP2 in 3 Minutes (Bilis-Gabay)' };
      case 'how-it-works':
        return { section: 'LEARN', title: 'How MP2 Works' };
      case 'methodology':
        return { section: 'LEARN', title: 'Guides & FAQ' };
      case 'historical':
        return { section: 'ADVANCED', title: 'Historical Dividend Rates' };
      case 'sensitivity':
        return { section: 'ADVANCED', title: 'Sensitivity Analysis' };
      case 'montecarlo':
        return { section: 'ADVANCED', title: 'Scenario Simulator (Monte Carlo)' };
      case 'compare':
        return { section: 'ADVANCED', title: 'Alternative Options Comparison' };
      case 'facilitator':
        return { section: 'ADVANCED', title: 'Facilitator Mode (LGU / Co-op)' };
      case 'sources':
        return { section: 'ADVANCED', title: 'Sources & Legal Basis' };
      case 'landing':
        return { section: 'INTRO', title: 'Welcome & Overview' };
      case 'saved':
        return { section: 'UTILITY', title: 'Saved Plans' };
      case 'settings':
        return { section: 'UTILITY', title: 'Settings' };
      default:
        return { section: 'COACH', title: 'Dashboard' };
    }
  };

  const breadcrumb = getTabBreadcrumb();

  // If viewing the public landing page, render dedicated editorial layout
  if (!isAuthenticated) {
    return (
      <LandingPage
        onEnterApp={(targetTab) => {
          try {
            localStorage.setItem('project_impok_auth', 'true');
          } catch {}
          setIsAuthenticated(true);
          setActiveTab(targetTab && targetTab !== 'landing' ? targetTab : 'dashboard');
        }}
        onSetContribution={(monthly) => {
          handleInputChange({ monthlyContribution: monthly });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased selection:bg-blue-100 selection:text-[#0B5CAB]">
      
      {/* 1. Persistent Desktop Sidebar & Mobile Drawer Navigation */}
      <Sidebar
        onLogout={() => {
          localStorage.removeItem('project_impok_auth');
          setIsAuthenticated(false);
          setActiveTab('landing');
        }}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'saved') {
            setIsSavedModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        savedScenariosCount={savedCount}
        appMode={appMode}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        
        {/* Top Header / App Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Mobile hamburger & breadcrumbs */}
            <div className="flex items-center space-x-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-1.5 text-xs text-slate-500 truncate">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  {breadcrumb.section}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-bold text-[#0F1E36] text-sm truncate">
                  {breadcrumb.title}
                </span>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center space-x-2 shrink-0">

              {/* Share / Copy link */}
              <button
                type="button"
                onClick={handleShare}
                className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                title="Copy shareable link with current plan inputs"
              >
                {copiedNotification ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Share</span>
                  </>
                )}
              </button>

              {/* Print / Export Report */}
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                title="Print or Save PDF report"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print</span>
              </button>

              {/* Saved Scenarios */}
              <button
                type="button"
                onClick={() => setIsSavedModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#0B5CAB] border border-blue-200 transition cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#0B5CAB]" />
                <span className="hidden sm:inline">Saved</span>
                {savedCount > 0 && (
                  <span className="bg-[#0B5CAB] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono-num font-bold">
                    {savedCount}
                  </span>
                )}
              </button>

            </div>

          </div>
        </header>

        {/* Workspace Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* 1. OVERVIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardView
              results={results}
              inputs={inputs}
              onNavigate={(tab) => setActiveTab(tab)}
              onUpdateRate={(rate) => handleInputChange({ assumedDividendRate: rate })}
              userNickname={userNickname}
              onEditNickname={() => {
                setNicknameInput(userNickname);
                setIsEditingNickname(true);
              }}
              appMode={appMode}
              onToggleMode={handleToggleMode}
              onApplyPlan={(monthly) => {
                handleInputChange({ monthlyContribution: monthly });
                setActiveTab('calculator');
              }}
            />
          )}

          {/* 2. PLAN: MP2 CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              {/* Core Inputs */}
              <CoreCalculator
                inputs={inputs}
                onChange={handleInputChange}
                onReset={handleReset}
              />

              {/* Summary KPIs */}
              <ResultsDashboard
                results={results}
                onNavigateTab={(tab) => setActiveTab(tab as ActiveTabType)}
              />

              {/* Trajectory Chart */}
              <InteractiveGrowthChart results={results} />

              {/* Detailed Year-by-Year Table */}
              <YearByYearTable results={results} />
            </div>
          )}

          {/* 3. PLAN: GOAL PLANNER */}
          {activeTab === 'goal' && (
            <GoalPlanner
              onApplyToCalculator={(monthly, initial, rate) => {
                handleInputChange({
                  monthlyContribution: monthly,
                  startingAmount: initial,
                  assumedDividendRate: rate,
                });
                setActiveTab('calculator');
              }}
            />
          )}

          {/* 4. PLAN: CONTRIBUTION STRATEGY */}
          {activeTab === 'strategies' && (
            <ContributionPlanner 
              assumedRate={inputs.assumedDividendRate}
              onApplyPreset={(newInputs) => {
                handleInputChange(newInputs);
                setActiveTab('calculator');
              }}
            />
          )}

          {/* 5. EXPLORE: MP2 LADDER */}
          {activeTab === 'ladder' && (
            <Mp2Ladder />
          )}

          {/* 6. EXPLORE: WHAT IF? (SCENARIO SIMULATOR) */}
          {activeTab === 'scenarios' && (
            <WhatIfView
              currentInputs={inputs}
              onApplyInputs={(newInputs) => {
                handleInputChange(newInputs);
                setActiveTab('calculator');
              }}
            />
          )}

          {/* 7. EXPLORE: INFLATION IMPACT */}
          {activeTab === 'inflation' && (
            <InflationAnalysis
              results={results}
              onUpdateInflation={(rate) => handleInputChange({ annualInflationRate: rate })}
            />
          )}

          {/* 8. LEARN: MP2 IN 3 MINUTES */}
          {activeTab === 'literacy' && (
            <Mp2In3Minutes onNavigate={setActiveTab} />
          )}

          {/* 9. LEARN: HOW MP2 WORKS */}
          {activeTab === 'how-it-works' && (
            <HowItWorksView />
          )}

          {/* 10. LEARN: METHODOLOGY & FAQ */}
          {activeTab === 'methodology' && (
            <MethodologyFaq />
          )}

          {/* 11. ADVANCED: HISTORICAL RATES */}
          {activeTab === 'historical' && (
            <HistoricalTracker
              onSelectRate={(rate) => {
                handleInputChange({ assumedDividendRate: rate });
                setActiveTab('calculator');
              }}
            />
          )}

          {/* 12. ADVANCED: SENSITIVITY MATRIX */}
          {activeTab === 'sensitivity' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E2E8F0]">
                <h1 className="text-xl font-black text-[#0F1E36]">
                  Sensitivity Analysis Matrix
                </h1>
                <p className="text-xs text-slate-500">
                  Cross-tabulate projected maturity values across varied monthly contribution and dividend rate bands
                </p>
              </div>
              <SensitivityMatrix
                currentInputs={inputs}
                onSelectCell={(monthly, rate) => {
                  handleInputChange({
                    monthlyContribution: monthly,
                    assumedDividendRate: rate,
                  });
                  setActiveTab('calculator');
                }}
              />
            </div>
          )}

          {/* 13. ADVANCED: MONTE CARLO SIMULATION */}
          {activeTab === 'montecarlo' && (
            <MonteCarloSimulation currentInputs={inputs} />
          )}

          {/* 14. ADVANCED: ALTERNATIVE INVESTMENTS */}
          {activeTab === 'compare' && (
            <CompareAlternatives currentInputs={inputs} />
          )}

          {/* 15. ADVANCED: FACILITATOR MODE (LGU / Co-op) */}
          {activeTab === 'facilitator' && (
            <FacilitatorModeView
              currentInputs={inputs}
              onApplyInputs={(newInputs) => {
                handleInputChange(newInputs);
                setActiveTab('calculator');
              }}
            />
          )}

          {/* 16. ADVANCED: SOURCES & ASSUMPTIONS */}
          {activeTab === 'sources' && (
            <SourcesAssumptionsView />
          )}

          {/* 17. UTILITY: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView
              currentInputs={inputs}
              onChangeInputs={handleInputChange}
              onResetDefaults={handleReset}
            />
          )}

        </main>

        {/* Authenticated workspace has no massive global footer, just the sidebar */}

      </div>

      {/* Nickname Edit Modal */}
      {isEditingNickname && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-50 text-[#0B5CAB] rounded-lg">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Ano ang tawag sa iyo?</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingNickname(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNickname} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pangalan o Nickname:
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder="Hal. Juan, Nanay, Kuya, Carlo"
                  autoFocus
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0B5CAB] focus:ring-1 focus:ring-[#0B5CAB]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Ginagamit ito para mas personal ang pag-coach sa iyo ng app. Naka-save lamang ito sa iyong browser.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingNickname(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Kanselahin
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#0B5CAB] hover:bg-[#155E9E] text-white transition cursor-pointer shadow-xs"
                >
                  I-save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Saved Scenarios Modal */}
      <SavedScenariosModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        currentInputs={inputs}
        onLoadScenario={(loadedInputs) => {
          setInputs(loadedInputs);
          setActiveTab('calculator');
        }}
      />

    </div>
  );
}
