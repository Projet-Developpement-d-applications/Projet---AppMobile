import React, { createContext, useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import Loading from '../components/Loading';

const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
    const [matchs, setMatchs] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                const equipesResponse = await Axios.get('https://conquerants.azurewebsites.net/noAuth/matchs');
                setMatchs(equipesResponse.data);
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
        <MatchContext.Provider value={{ matchs }}>
            {children}
        </MatchContext.Provider>
    );
};

export const useMatch = () => useContext(MatchContext);

export default MatchContext;
