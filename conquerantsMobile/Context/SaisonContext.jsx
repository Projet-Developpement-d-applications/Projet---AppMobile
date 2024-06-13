import React, { createContext, useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import Loading from '../components/Loading';

const SaisonContext = createContext();

export const SaisonProvider = ({ children }) => {
  const [saison, setSaison] = useState("");
  const [saisons, setSaisons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const saisonsResponse = await Axios.get('https://conquerants.azurewebsites.net/noAuth/saisons');
        setSaisons(saisonsResponse.data);
        setSaison(saisonsResponse.data[saisonsResponse.data.length - 1]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <SaisonContext.Provider value={{ saison, setSaison, saisons }}>
      {children}
    </SaisonContext.Provider>
  );
};

export const useSaison = () => useContext(SaisonContext);

export default SaisonContext;
