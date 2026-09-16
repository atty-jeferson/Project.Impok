const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// Replace top navigation
content = content.replace(
  /<nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">[\s\S]*?<\/nav>/,
  `<nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">
              <button onClick={() => onEnterApp('how-it-works')} className="hover:text-[#0B5CAB] transition cursor-pointer">How It Works</button>
              <button onClick={() => onEnterApp('methodology')} className="hover:text-[#0B5CAB] transition cursor-pointer">Methodology</button>
              <button onClick={() => onEnterApp('literacy')} className="hover:text-[#0B5CAB] transition cursor-pointer">MP2 in 3 Minutes</button>
              <button onClick={() => onEnterApp('dashboard')} className="hover:text-[#0B5CAB] transition cursor-pointer">Log In</button>
            </nav>`
);

content = content.replace(
  /<span>Plan My Savings<\/span>/g,
  `<span>Start My Plan</span>`
);

// Replace hero section
content = content.replace(
  /<h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-\[#0F1E36\] tracking-tight leading-\[1.12\]">[\s\S]*?<\/h1>/,
  `<h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0F1E36] tracking-tight leading-[1.12]">
            Your savings deserve <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B5CAB] to-[#3B82F6]">a plan.</span>
          </h1>`
);

content = content.replace(
  /<p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">[\s\S]*?<\/p>/,
  `<p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Understand what your MP2 savings could become — starting with what you can realistically set aside.
          </p>`
);

// Replace secondary CTA in Hero
content = content.replace(
  /href="#how-it-works-section"[\s\S]*?<span>See How It Works<\/span>[\s\S]*?<\/a>/,
  `onClick={() => onEnterApp('how-it-works')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-xl text-sm font-bold bg-white text-slate-700 hover:text-[#0B5CAB] hover:bg-slate-50 border border-slate-300 transition shadow-2xs cursor-pointer"
            >
              <span>See How It Works</span>
            </button>`
);

// Remove Section 7 (Trust & Methodology) completely
content = content.replace(
  /\{\/\* 7\. TRUST & METHODOLOGY SECTION \*\/\}[\s\S]*?\{\/\* 8\. FINAL WARM CTA SECTION \*\/\}/,
  `{/* 8. FINAL WARM CTA SECTION */}`
);

// Add state for collapsible footer disclosure
if (!content.includes('const [isDisclosureOpen, setIsDisclosureOpen]')) {
  content = content.replace(
    /const \[previewMonthly, setPreviewMonthly\] = useState<number>\(2000\);/,
    `const [previewMonthly, setPreviewMonthly] = useState<number>(2000);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);`
  );
}

// Modify footer to add the Collapsible Disclosure
const newFooter = `
      {/* 9. CLEAN FOOTER */}
      <footer className="bg-white border-t border-slate-200">
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ProjectImpokLogo size={20} variant="color" />
            <span className="font-bold text-slate-700 text-xs">PROJECT IMPOK</span>
            <span className="text-slate-500 text-xs">— Your MP2 Financial Coach</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
            <button 
              type="button" 
              onClick={() => onEnterApp('literacy')} 
              className="hover:text-[#0B5CAB] transition cursor-pointer"
            >
              MP2 in 3 Minutes
            </button>
            <button 
              type="button" 
              onClick={() => onEnterApp('how-it-works')} 
              className="hover:text-[#0B5CAB] transition cursor-pointer"
            >
              How It Works
            </button>
            <button 
              type="button" 
              onClick={() => onEnterApp('methodology')} 
              className="hover:text-[#0B5CAB] transition cursor-pointer"
            >
              Methodology
            </button>
            <button 
              type="button" 
              onClick={() => onEnterApp('settings')} 
              className="hover:text-[#0B5CAB] transition cursor-pointer"
            >
              Settings
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <button 
            type="button"
            onClick={() => setIsDisclosureOpen(!isDisclosureOpen)}
            className="w-full py-4 flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-700 transition cursor-pointer"
          >
            <span className="font-semibold">Independent Public Education Notice</span>
            {isDisclosureOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isDisclosureOpen && (
            <div className="pb-6 text-[11px] text-slate-500 leading-relaxed space-y-3 max-w-4xl">
              <p>
                <strong>Independent Public Education Notice:</strong> PROJECT IMPOK is an independent planning and financial-education tool created to help savers model Pag-IBIG Modified Pag-IBIG II outcomes under Republic Act No. 9679. This application is not an official portal of, operated by, or affiliated with the Home Development Mutual Fund (Pag-IBIG Fund).
              </p>
              <p>
                Pag-IBIG guarantees the savings capital (principal) under Republic Act No. 9679, but dividend rates vary according to the Fund's annual financial performance and are not guaranteed. Projections are mathematical estimates based on user-provided assumptions.
              </p>
              <div className="pt-2 pb-2">
                © {new Date().getFullYear()} PROJECT IMPOK
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
`;

content = content.replace(
  /\{\/\* 9\. CLEAN FOOTER \*\/\}[\s\S]*?<\/div>\s*\);\s*\};/,
  newFooter
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Done modifying LandingPage.tsx');
