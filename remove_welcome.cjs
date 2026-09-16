const fs = require('fs');

// 1. Sidebar.tsx
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebar = sidebar.replace(/\s*\{ id: 'landing', label: 'Welcome Page' \},/, '');
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);

// 2. App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(
  /\s*\{\/\* Back to Welcome \/ Landing Page \*\/\}\s*<button\s*type="button"\s*onClick=\{\(\) => setActiveTab\('landing'\)\}\s*className="hidden md:inline-flex items-center space-x-1 px-2\.5 py-1\.5 rounded-md text-xs font-semibold text-slate-600 hover:text-\[#0B5CAB\] hover:bg-slate-100 transition cursor-pointer"\s*title="Return to Welcome \/ Landing Page"\s*>\s*<span>← Welcome Page<\/span>\s*<\/button>/,
  ''
);
fs.writeFileSync('src/App.tsx', app);
