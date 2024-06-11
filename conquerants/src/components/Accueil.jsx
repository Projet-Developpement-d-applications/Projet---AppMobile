import React, { useState } from 'react';
import MatchCarousel from './MatchCarousel';
import MatchSemaine from './MatchSemaine';
import "../styles/Accueil.css";
import Axios from 'axios';
import { useQuery } from 'react-query';
import Loading from './Loading';
import Erreur from './Erreur';

Axios.defaults.baseURL = 'https://conquerants.azurewebsites.net';
Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

function Accueil({ langue }) {

    const [matchsSemaine, setMatchsSemaine] = useState([]);
    const [matchsAVenir, setMatchsAVenir] = useState([]);
    const [jeux, setJeux] = useState([]);

    const fetchMatchAVenir = async () => {
        await Axios.get("https://conquerants.azurewebsites.net/noAuth/matchAVenir").then((response) => {
         setMatchsAVenir(response.data);
        }).catch((error) => {
         console.error("Error fecthing data", error);
        });
      };

      const fetchJeux = async () => {
        await Axios.get("https://conquerants.azurewebsites.net/noAuth/jeux").then((response) => {
            setJeux(response.data);
        }).catch((error) => {
            console.error("Error fecthing data", error);
        });
    }

    const fetchMatchsSemaine = async () => {
        await Axios.get("https://conquerants.azurewebsites.net/noAuth/matchDeLaSemaine").then((response) => {
            setMatchsSemaine(response.data);
        }).catch((error) => {
         console.error("Error fecthing data", error);
        });
      };
    
    const {isFetching: isFetching1, isError: isError1} = useQuery({
        queryFn: () => fetchMatchsSemaine(),
        queryKey: ["matchsSemaine"],
        refetchOnWindowFocus: false,
    });

    const {isFetching: isFetching2, isError: isError2} = useQuery({
        queryFn: () => fetchJeux(),
        queryKey: ["jeux"],
        refetchOnWindowFocus: false,
    });
      
    const {isFetching: isFetching3, isError: isError3} = useQuery({
        queryFn: () => fetchMatchAVenir(),
        queryKey: ["matchsAVenir"],
        refetchOnWindowFocus: false,
    });

    if (isFetching1 || isFetching2 || isFetching3) {
        return <Loading/>
    }
    
    if (isError1 || isError2 || isError3) {
        return <Erreur/>
    }

    return (
        <div className="App">
            <MatchCarousel langue={langue} matchs={matchsAVenir}></MatchCarousel>
            <div className='Accueil'>
                <div className='content'>
                    <MatchSemaine langue={langue} jeux={jeux} matchs={matchsSemaine}/>
                </div>
            </div>
        </div>
    );
}

export default Accueil;