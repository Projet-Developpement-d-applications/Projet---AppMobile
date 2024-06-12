import React, { createContext, useState, useContext, useEffect } from 'react';
import lang from '../json/lang.json';
import CookieManager from '@react-native-cookies/cookies';

const LangueContext = createContext();

export const LangueProvider = ({ children }) => {
  const [langue, setLangue] = useState(lang.fr);

  const handleLangue = async (langueType) => {
    const newLangue = langueType === 'fr' ? lang.fr : lang.en;
    setLangue(newLangue);
    await creerCookieLangue(langueType);
  };

  const creerCookieLangue = async () => {
    try {
      await CookieManager.set('http://localhost', {
        name: 'langue',
        value: langue.type,
        expires: '365'});
    } catch (error) {
      console.error('Error setting language in cookies:', error);
    }
  }

  const getCookieLangue = async () => {
    try {
      const langueTemp = await CookieManager.get('http://localhost');
      if (langueTemp.langue) {
        handleLangue(langueTemp.langue.value);
      }
    } catch (error) {
      console.error('Error getting language from cookies:', error);
    }
  }

  return (
    <LangueContext.Provider value={{ langue, getCookieLangue, handleLangue }}>
      {children}
    </LangueContext.Provider>
  );
};

export const useLangue = () => useContext(LangueContext);

export default LangueContext;
