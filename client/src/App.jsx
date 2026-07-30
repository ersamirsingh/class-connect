import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './app/router/AppRouter';

export const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
