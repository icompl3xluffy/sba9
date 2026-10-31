import { useState } from 'react';
import './App.css';
import type { Theme } from './types';
import Dashboard from './component/Dashboard/Dashboard';

function App() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <div className={`app ${theme}`}>
      <Dashboard
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
    </div>
  );
}

export default App;
