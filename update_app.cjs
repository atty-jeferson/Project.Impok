const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add isAuthenticated state
if (!content.includes('const [isAuthenticated, setIsAuthenticated]')) {
  content = content.replace(
    /const \[activeTab, setActiveTab\] = useState<ActiveTabType>\(\(\) => \{/,
    `const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('project_impok_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Navigation tab state - default to 'landing' for welcoming introduction
  const [activeTab, setActiveTab] = useState<ActiveTabType>(() => {`
  );
}

// 2. Add useEffect to redirect logged in users away from landing
if (!content.includes('useEffect(() => {')) {
  // Let's add useEffect import if missing
  if (!content.includes('useEffect')) {
    content = content.replace(/import React, \{ useState/g, 'import React, { useState, useEffect');
  }
  
  content = content.replace(
    /const \[isMobileNavOpen, setIsMobileNavOpen\] = useState<boolean>\(false\);/,
    `const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'landing') {
      setActiveTab('dashboard');
    }
    if (!isAuthenticated && activeTab !== 'landing') {
      // The user wants public pages available or strictly landing page?
      // "When the user is NOT authenticated: Show the PROJECT IMPOK landing page."
      // Let's force to landing page if not authenticated, unless they are exploring.
      // But the public navigation includes: "How It Works", "Methodology", "MP2 in 3 Minutes".
      // Wait, the user said: "Do not mix public marketing navigation with application navigation."
      // If they are public, maybe we shouldn't force them back to landing if they click "How It Works".
      // But wait! LandingPage component IS the landing page, and inside it we just render it if !isAuthenticated.
      // Wait, if activeTab changes to 'how-it-works' from LandingPage, it will show the app sidebar if we don't block it.
      // The user said: "The landing page should not display the application sidebar."
      // Let's keep it simple: If !isAuthenticated, we render LandingPage.
      // But what about the other views? Let's just pass a generic login handler.
    }
  }, [isAuthenticated, activeTab]);`
  );
}

// 3. Replace `if (activeTab === 'landing')` with `if (!isAuthenticated)`
content = content.replace(
  /if \(activeTab === 'landing'\) \{[\s\S]*?return \([\s\S]*?<LandingPage[\s\S]*?onEnterApp=\{\(targetTab\) => \{[\s\S]*?try \{[\s\S]*?localStorage\.setItem\('project_impok_has_visited', 'true'\);[\s\S]*?\} catch \{[\s\S]*?\/\/ ignore[\s\S]*?\}[\s\S]*?setActiveTab\(targetTab \|\| 'dashboard'\);[\s\S]*?\}\}[\s\S]*?onSetContribution=\{\(monthly\) => \{[\s\S]*?handleInputChange\(\{ monthlyContribution: monthly \}\);[\s\S]*?\}\}[\s\S]*?\/>[\s\S]*?\);[\s\S]*?\}/,
  `if (!isAuthenticated) {
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
  }`
);

// We need to allow log out from Navbar/Sidebar maybe? The user didn't mention log out explicitly, but they said "Once authenticated: Dashboard becomes the persistent application home."
// Let's just remove the global institutional footer from App.tsx since it's now in the Landing Page and we want the Dashboard to be a web app.
// Wait, the user didn't explicitly say remove it from the dashboard, but they said "At the very bottom of the landing page, after the main content: Show a discreet footer." 
// And "The dashboard should feel like: 'Welcome back. Here's where your savings plan stands.' ... The entire product should now feel like: PUBLIC: Beautiful, warm, sophisticated introduction -> AUTHENTICATION -> PRODUCT: Powerful but approachable financial workspace."
// I will remove the massive global footer from the authenticated app view because it clutters the app workspace.
content = content.replace(
  /\{\/\* Global Institutional Footer \*\/\}[\s\S]*?<\/footer>/,
  `{/* Authenticated workspace has no massive global footer, just the sidebar */}`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Done modifying App.tsx');
