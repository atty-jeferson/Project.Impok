const fs = require('fs');

let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

// Add onLogout to interface
content = content.replace(
  /onToggleCollapse\?: \(\) => void;\n\}/,
  `onToggleCollapse?: () => void;\n  onLogout?: () => void;\n}`
);

// Add onLogout to destructured props
content = content.replace(
  /onToggleCollapse,\n\}\) => \{/,
  `onToggleCollapse,\n  onLogout,\n}) => {`
);

// Add the logout button in Bottom Utilities
content = content.replace(
  /\{\/\* Settings \*\/\}/,
  `{/* Sign Out */}
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

             {/* Settings */}`
);

fs.writeFileSync('src/components/Sidebar.tsx', content);
