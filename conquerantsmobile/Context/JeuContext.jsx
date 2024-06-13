import React, { createContext, useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import Loading from '../components/Loading';

const JeuContext = createContext();

export const JeuProvider = ({ children }) => {
    const [jeux, setJeux] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                const jeuxResponse = await Axios.get('https://conquerants.azurewebsites.net/noAuth/jeux');
                setJeux(jeuxResponse.data);
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
        <JeuContext.Provider value={{ jeux }}>
            {children}
        </JeuContext.Provider>
    );
};

export const useJeu = () => useContext(JeuContext);

export default JeuContext;
