import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calculator,
  Target,
  TrendingUp,
  Layers,
  HelpCircle,
  Percent,
  Clock,
  ArrowUpDown,
  Sparkles,
  Compass,
  BookOpen,
  FileCode,
  Users,
  Database,
  Bookmark,
  Settings,
  X,
  Search,
  Menu
} from 'lucide-react';
import { ActiveTabType, AppMode } from '../types/mp2';
import { ProjectImpokLogo } from './ProjectImpokLogo';

interface SidebarProps {
  activeTab: ActiveTabType;
  onSelectTab: (tab: ActiveTabType) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  savedScenariosCount?: number;
  appMode?: AppMode;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogout?: () => void;
}

type PrimaryModule = 'home' | 'plan' | 'explore' | 'learn' | 'utility';

interface SecondaryNavItem {
  id: ActiveTabType | 'saved';
  label: string;
  badge?: string;
  action?: () => void; // for things like modal
}

interface SecondaryNavGroup {
  title?: string;
  items: SecondaryNavItem[];
}

interface ModuleConfig {
  id: PrimaryModule;
  label: string;
  icon: React.ElementType;
  defaultTab: ActiveTabType;
  description: string;
  groups: SecondaryNavGroup[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  savedScenariosCount = 0,
  isCollapsed = false,
  onToggleCollapse,
  onLogout,
}) => {
  const getPrimaryModule = (tab: ActiveTabType): PrimaryModule => {
    if (['landing', 'dashboard'].includes(tab)) return 'home';
    if (['calculator', 'goal', 'strategies'].includes(tab)) return 'plan';
    if (['scenarios', 'ladder', 'inflation', 'historical', 'sensitivity', 'montecarlo', 'compare'].includes(tab)) return 'explore';
    if (['literacy', 'how-it-works', 'methodology', 'facilitator', 'sources'].includes(tab)) return 'learn';
    if (['settings'].includes(tab)) return 'utility';
    return 'home';
  };

  const currentModule = getPrimaryModule(activeTab);
  const [activeModule, setActiveModule] = useState<PrimaryModule>(currentModule);

  // Keep sidebar module in sync with active tab if changed externally
  useEffect(() => {
    setActiveModule(getPrimaryModule(activeTab));
  }, [activeTab]);

  const handlePrimaryClick = (moduleId: PrimaryModule, defaultTab: ActiveTabType) => {
    setActiveModule(moduleId);
    onSelectTab(defaultTab);
  };

  const MODULES: Record<PrimaryModule, ModuleConfig> = {
    home: {
      id: 'home',
      label: 'Home',
      icon: LayoutDashboard,
      defaultTab: 'dashboard',
      description: 'Your central savings overview.',
      groups: [
        {
          items: [
            { id: 'dashboard', label: 'Dashboard' }
          ]
        }
      ]
    },
    plan: {
      id: 'plan',
      label: 'Plan',
      icon: Calculator,
      defaultTab: 'calculator',
      description: 'Build and understand your MP2 savings plan.',
      groups: [
        {
          title: 'YOUR PLAN',
          items: [
            { id: 'calculator', label: 'My MP2 Projection' },
            { id: 'goal', label: 'My Savings Goal' },
            { id: 'strategies', label: 'Ways to Save' }
          ]
        }
      ]
    },
    explore: {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      defaultTab: 'scenarios',
      description: 'Discover possibilities and analyze outcomes.',
      groups: [
        {
          title: 'SCENARIOS',
          items: [
            { id: 'scenarios', label: 'What If?' },
            { id: 'compare', label: 'Alternative Options' }
          ]
        },
        {
          title: 'ANALYSIS',
          items: [
            { id: 'ladder', label: 'MP2 Ladder (5-Yr Cycles)' },
            { id: 'inflation', label: 'Inflation & Value' },
            { id: 'historical', label: 'Historical Rates' },
            { id: 'sensitivity', label: 'Sensitivity Matrix' },
            { id: 'montecarlo', label: 'Monte Carlo Simulator' }
          ]
        }
      ]
    },
    learn: {
      id: 'learn',
      label: 'Learn',
      icon: BookOpen,
      defaultTab: 'literacy',
      description: 'Understand how the MP2 program works.',
      groups: [
        {
          title: 'START HERE',
          items: [
            { id: 'literacy', label: 'MP2 in 3 Minutes' },
            { id: 'how-it-works', label: 'How MP2 Works' }
          ]
        },
        {
          title: 'GO DEEPER',
          items: [
            { id: 'methodology', label: 'Guides & FAQ' },
            { id: 'facilitator', label: 'Facilitator Mode' },
            { id: 'sources', label: 'Sources & Legal Basis' }
          ]
        }
      ]
    },
    utility: {
      id: 'utility',
      label: 'Settings',
      icon: Settings,
      defaultTab: 'settings',
      description: 'Manage your preferences.',
      groups: [
        {
          title: 'UTILITIES',
          items: [
            { id: 'settings', label: 'App Settings' }
          ]
        }
      ]
    }
  };

  const activeModuleConfig = MODULES[activeModule];

  // Mobile drawer content (combined view)
  const renderMobileContent = () => (
    <div className="flex flex-col h-full bg-[#0F1E36] text-white">
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <ProjectImpokLogo size={24} className="text-white" />
          <span className="font-bold text-sm tracking-wider uppercase">PROJECT IMPOK</span>
        </div>
        <button onClick={onCloseMobile} className="p-2 text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.values(MODULES).map(mod => (
          <div key={mod.id} className="space-y-2">
            <div className="flex items-center space-x-2 text-blue-300 font-bold uppercase text-xs tracking-wider mb-3">
              <mod.icon className="w-4 h-4" />
              <span>{mod.label}</span>
            </div>
            {mod.groups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1 ml-6">
                {group.title && <div className="text-[10px] text-white/40 uppercase font-semibold mt-3 mb-1">{group.title}</div>}
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) { item.action(); }
                      else { onSelectTab(item.id as ActiveTabType); }
                      onCloseMobile();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === item.id ? 'bg-blue-600 text-white font-semibold' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
        {/* Saved Modal Trigger Mobile */}
        <div className="pt-4 border-t border-white/10 ml-6">
          <button
            onClick={() => { onSelectTab('saved' as ActiveTabType); onCloseMobile(); }}
            className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5"
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Plans</span>
            {savedScenariosCount > 0 && (
               <span className="ml-auto bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                 {savedScenariosCount}
               </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Two-Level) */}
      <aside className="hidden lg:flex shrink-0 h-screen sticky top-0 z-30 shadow-2xl">
        
        {/* 1. PRIMARY SIDEBAR (Global Navigation Rail) */}
        <div className="w-[72px] bg-[#0A1628] flex flex-col items-center py-4 border-r border-[#1C2C47] relative overflow-hidden z-20">
          
          {/* Subtle atmospheric glow behind primary rail */}
          <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />

          {/* Brand Logo */}
          <button 
            onClick={() => handlePrimaryClick('home', 'dashboard')}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F1E36] to-[#0B5CAB] border border-blue-400/20 flex items-center justify-center shadow-lg hover:shadow-blue-900/50 transition-all group mb-6 cursor-pointer"
            title="PROJECT IMPOK"
          >
            <ProjectImpokLogo size={22} className="text-white group-hover:scale-105 transition-transform" />
          </button>

          {/* Main Modules */}
          <nav className="flex-1 flex flex-col space-y-3 w-full px-3">
            {[MODULES.home, MODULES.plan, MODULES.explore, MODULES.learn].map(mod => {
              const isActive = activeModule === mod.id;
              return (
                <div key={mod.id} className="relative group w-full flex justify-center">
                  <button
                    onClick={() => handlePrimaryClick(mod.id, mod.defaultTab)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer relative z-10 ${
                      isActive
                        ? 'bg-[#153460] text-blue-100 shadow-inner'
                        : 'text-slate-400 hover:text-blue-200 hover:bg-[#112440]'
                    }`}
                  >
                    <mod.icon className="w-5 h-5 shrink-0" />
                  </button>
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex z-50 pointer-events-none">
                    <div className="bg-[#0F1E36] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700/80 whitespace-nowrap">
                      {mod.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Bottom Utilities */}
          <div className="flex flex-col space-y-3 w-full px-3 mt-auto">
             <div className="w-6 mx-auto border-t border-[#1C2C47] mb-1" />
             
             {/* Saved Plans */}
             <div className="relative group w-full flex justify-center">
                <button
                  onClick={() => onSelectTab('saved' as ActiveTabType)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-200 hover:bg-[#112440] transition-all cursor-pointer relative z-10"
                >
                  <Bookmark className="w-5 h-5 shrink-0" />
                  {savedScenariosCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0A1628]" />
                  )}
                </button>
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex z-50 pointer-events-none">
                  <div className="bg-[#0F1E36] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700/80 whitespace-nowrap">
                    Saved Plans
                  </div>
                </div>
             </div>

             {/* Sign Out */}
             {onLogout && (
               <div className="relative group w-full flex justify-center">
                  <button
                    onClick={onLogout}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-[#112440] transition-all cursor-pointer relative z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  </button>
                  
                  {/* Tooltip */}
                  {!isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-700/50 z-50">
                      Sign Out
                    </div>
                  )}
               </div>
             )}

             {/* Settings */}
             <div className="relative group w-full flex justify-center">
                <button
                  onClick={() => handlePrimaryClick('utility', 'settings')}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative z-10 ${
                    activeModule === 'utility'
                      ? 'bg-[#153460] text-blue-100 shadow-inner'
                      : 'text-slate-400 hover:text-blue-200 hover:bg-[#112440]'
                  }`}
                >
                  <Settings className="w-5 h-5 shrink-0" />
                </button>
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex z-50 pointer-events-none">
                  <div className="bg-[#0F1E36] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700/80 whitespace-nowrap">
                    Settings
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* 2. SECONDARY SIDEBAR (Contextual Navigation) */}
        <div 
          className={`bg-[#112038] border-r border-[#1E2E4A] flex flex-col relative z-10 overflow-hidden text-slate-300 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-0 border-r-0' : 'w-[260px]'
          }`}
        >
          {/* Subtle gradient overlay top */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#162D50] to-transparent pointer-events-none opacity-50" />

          {/* Context Header */}
          <div className="p-6 pb-4 relative z-10 min-w-[260px]">
             <div className="flex items-center space-x-3 text-white mb-2">
                <activeModuleConfig.icon className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold tracking-wide">{activeModuleConfig.label}</h2>
             </div>
             <p className="text-xs text-slate-400/80 leading-relaxed font-medium">
               {activeModuleConfig.description}
             </p>
          </div>

          {/* Contextual Navigation Items */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6 relative z-10 min-w-[260px] scrollbar-thin scrollbar-thumb-[#1E2E4A] scrollbar-track-transparent">
             {activeModuleConfig.groups.map((group, idx) => (
               <div key={idx} className="space-y-1.5">
                  {group.title && (
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-3 mb-2">
                      {group.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {group.items.map(item => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.action) { item.action(); }
                            else { onSelectTab(item.id as ActiveTabType); }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer text-left ${
                            isActive
                              ? 'bg-blue-600/20 text-blue-100 font-semibold shadow-inner border border-blue-500/20'
                              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="shrink-0 bg-blue-900/50 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-700/50">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Toggle Button Attached Directly to the Sidebar's Right Edge */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`absolute top-6 z-40 w-6 h-10 rounded-r-md bg-[#112038] border-y border-r border-[#1E2E4A] shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-300 hover:bg-[#162D50] focus:outline-none transition-all cursor-pointer ${
              isCollapsed ? 'left-[72px]' : 'left-[332px]'
            }`}
            title={isCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            <div className="w-1 h-4 border-l-2 border-r-2 border-slate-500/50 rounded-sm pointer-events-none" />
          </button>
        )}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#0F1E36]/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-[280px] shadow-2xl z-50">
            {renderMobileContent()}
          </div>
        </div>
      )}
    </>
  );
};

