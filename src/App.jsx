import { useState } from 'react';
import LoginGate from './components/LoginGate';
import MainView from './components/MainView';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <LoginGate onLogin={handleLogin} />
      ) : (
        <MainView />
      )}
    </div>
  );
}

export default App;
