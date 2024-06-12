import React from 'react';
import { LangueProvider } from './Context/LangueContext';
import AppScreen from './screens/AppSceen'
import { AuthProvider } from './Context/AuthContext';
import { StatusBar } from 'react-native';

const App = () => {
  return (
    <LangueProvider>
    <AuthProvider>
      <StatusBar backgroundColor='#6e171d' barStyle='light-content'/>
      <AppScreen />
    </AuthProvider>
    </LangueProvider>
  );
};

export default App;
