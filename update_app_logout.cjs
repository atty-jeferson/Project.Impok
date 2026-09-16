const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /isCollapsed=\{!isSidebarExpanded\}\n\s*onToggleCollapse=\{\(\) => setIsSidebarExpanded\(!isSidebarExpanded\)\}/,
  `isCollapsed={!isSidebarExpanded}\n            onToggleCollapse={() => setIsSidebarExpanded(!isSidebarExpanded)}\n            onLogout={() => {\n              localStorage.removeItem('project_impok_auth');\n              setIsAuthenticated(false);\n              setActiveTab('landing');\n            }}`
);

fs.writeFileSync('src/App.tsx', content);
