const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

content = content.replace(
  /projectionYears: 5\s*\}\);/,
  "projectionYears: 5,\n    annualInflationRate: 4,\n    startYear: new Date().getFullYear()\n  });"
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
