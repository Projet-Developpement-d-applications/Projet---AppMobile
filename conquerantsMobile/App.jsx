import React from 'react';
import { LangueProvider } from './Context/LangueContext';
import AppScreen from './screens/AppSceen'
import { AuthProvider } from './Context/AuthContext';
import { StatusBar } from 'react-native';
import { SaisonProvider } from './Context/SaisonContext';
import { JeuProvider } from './Context/JeuContext';
import { MatchProvider } from './Context/MatchContext';
import { EquipeProvider } from './Context/EquipeContext';

const App = () => {
  return (
    <LangueProvider>
    <AuthProvider>
    <SaisonProvider>
    <JeuProvider>
    <MatchProvider>
    <EquipeProvider>
      <StatusBar backgroundColor='#d3333e' barStyle='light-content'/>
      <AppScreen />
    </EquipeProvider>
    </MatchProvider>
    </JeuProvider>
    </SaisonProvider>
    </AuthProvider>
    </LangueProvider>
  );
};

export default App;
