const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');
content = content.replace(
  /<button onClick=\{\(\) => onEnterApp\('how-it-works'\)\} className="hover:text-\[#0B5CAB\] transition cursor-pointer">How It Works<\/button>/,
  `<a href="#how-it-works-section" className="hover:text-[#0B5CAB] transition cursor-pointer">How It Works</a>`
);
fs.writeFileSync('src/components/LandingPage.tsx', content);
