import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

interface AppShellProps {
  searchCommand: React.ReactNode;
  main: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ searchCommand, main }) => (
  <Router>
    {searchCommand}
    <Routes>
      <Route path="/" element={main} />
    </Routes>
  </Router>
);
