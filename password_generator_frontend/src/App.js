import React from 'react';
import PasswordGenerator from './PasswordGenerator';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main App component that renders the Password Generator application.
 * This is the entry point for the application.
 */
function App() {
  return (
    <div className="App">
      <PasswordGenerator />
    </div>
  );
}

export default App;
