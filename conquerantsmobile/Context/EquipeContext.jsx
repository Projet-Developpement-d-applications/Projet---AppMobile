import React, { createContext, useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import Loading from '../components/Loading';

const EquipeContext = createContext();

export const EquipeProvider = ({ children }) => {
    const [equipes, setEquipes] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                const equipesResponse = await Axios.get('https://conquerants.azurewebsites.net/noAuth/toutesEquipesLimoilou');
                setEquipes(equipesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <EquipeContext.Provider value={{ equipes, setEquipes }}>
            {children}
        </EquipeContext.Provider>
    );
};

export const useEquipe = () => useContext(EquipeContext);

export default EquipeContext;
