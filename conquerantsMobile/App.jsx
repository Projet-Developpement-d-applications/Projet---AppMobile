import React from 'react';
import { LangueProvider } from './Context/LangueContext';
import AppScreen from './screens/AppSceen'
import { AuthProvider } from './Context/AuthContext';

const App = () => {
  return (
    <LangueProvider>
    <AuthProvider>
      <AppScreen />
    </AuthProvider>
    </LangueProvider>
  );
};

export default App;
