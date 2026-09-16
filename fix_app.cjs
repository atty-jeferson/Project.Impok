const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /<Sidebar/,
  `<Sidebar
        onLogout={() => {
          localStorage.removeItem('project_impok_auth');
          setIsAuthenticated(false);
          setActiveTab('landing');
        }}`
);
fs.writeFileSync('src/App.tsx', content);
