import React from 'react';
import { LangueProvider } from './Context/LangueContext';
import AppScreen from './screens/AppSceen'
import { AuthProvider } from './Context/AuthContext';
import { StatusBar } from 'react-native';
import { SaisonProvider } from './Context/SaisonContext';

const App = () => {
  return (
    <LangueProvider>
    <AuthProvider>
    <SaisonProvider>
      <StatusBar backgroundColor='#d3333e' barStyle='light-content'/>
      <AppScreen />
    </SaisonProvider>
    </AuthProvider>
    </LangueProvider>
  );
};

export default App;
