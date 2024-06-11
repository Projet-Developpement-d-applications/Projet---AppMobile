import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "../styles/Admin.css";
import Loading from './Loading';

function AjoutMatchs({ langue }) {
    const [jeu, setJeu] = useState('');
    const [saison, setSaison] = useState('');
    const [equipe1, setEquipe1] = useState('');
    const [equipe2, setEquipe2] = useState('');
    const [scoreEquipe1, setScoreEquipe1] = useState('');
    const [scoreEquipe2, setScoreEquipe2] = useState('');
    const [datetime, setDatetime] = useState('');

    const [jeux, setJeux] = useState([]);
    const [saisons, setSaisons] = useState([]);
    const [equipes, setEquipes] = useState([]);

    const [creerMatchStatusErreur, setCreerMatchStatusErreur] = useState('');
    const [creerMatchStatusSucces, setCreerMatchStatusSucces] = useState('');

    const [loading, setLoading] = useState(true);

    Axios.defaults.baseURL = 'https://conquerants.azurewebsites.net';
    Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    // Dynamic Jeux et Saisons
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [jeuxResponse, saisonsResponse] = await Promise.all([
                    Axios.get('https://conquerants.azurewebsites.net/noAuth/jeux'),
                    Axios.get('https://conquerants.azurewebsites.net/noAuth/saisons')
                ]);
                setJeux(jeuxResponse.data);
                setSaisons(saisonsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Dynamic Equipes
    useEffect(() => {
        const fetchEquipes = async () => {
            if (jeu && saison) {
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/equipeParJeu', { jeu, saison }, { withCredentials: true });
                    setEquipes(response.data);
                } catch (error) {
                    console.error('Error fetching teams:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setEquipes([]);
            }
        };

        fetchEquipes();
    }, [jeu, saison]);

    const creerMatch = () => {
        resetStatusMessage();
        setLoading(true);

        Axios.post('https://conquerants.azurewebsites.net/admin/nouveauMatch', {
            id_equipe1: equipe1,
            id_equipe2: equipe2,
            score1: scoreEquipe1,
            score2: scoreEquipe2,
            date: datetime,
            jouer: false
        }, { withCredentials: true }).then((response) => {
            setCreerMatchStatusSucces(response.data);
            resetValues();
        }).catch((error) => {
            setCreerMatchStatusErreur(error.response.data);
        }).finally(() => {
            setLoading(false);
        });
    };

    const resetValues = () => {
        setSaison('');
        setJeu('')
        setEquipe1('');
        setEquipe2('');
        setScoreEquipe1('');
        setScoreEquipe2('');
        setDatetime('');
    };

    const resetStatusMessage = () => {
        setCreerMatchStatusErreur('');
        setCreerMatchStatusSucces('');
    };

    const handleChangeDefault = (value, setter) => {
        setter(value);
    };

    const handleChangeSaisonAndJeu = (value, setter) => {
        setEquipe1('')
        setEquipe2('');

        setter(value);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='App'>
            <div className='ajoutMatchs'>
                <h2>{langue.ajoutMatch.h2}</h2>

                <label>{langue.saison}</label>
                <select
                    value={saison}
                    onChange={(e) => handleChangeSaisonAndJeu(e.target.value, setSaison)}
                >
                    <option value=''></option>
                    {saisons.map((saison) => (
                        <option key={saison.id} value={saison.debut}>{saison.debut}-{saison.fin}</option>
                    ))}
                </select>

                <label>{langue.jeu}</label>
                <select
                    value={jeu}
                    onChange={(e) => handleChangeSaisonAndJeu(e.target.value, setJeu)}
                >
                    <option value=''></option>
                    {jeux.map((jeu) => (
                        <option key={jeu.id} value={jeu.nom}>{jeu.nom}</option>
                    ))}
                </select>

                <label>{langue.ajoutMatch.e1}</label>
                <select
                    value={equipe1}
                    onChange={(e) => {
                        handleChangeDefault(e.target.value, setEquipe1);
                    }}
                    disabled={!jeu || !saison}
                >
                    <option value=''></option>
                    {equipes.filter(equipe => equipe.id != equipe2).map((equipe) => (
                        <option key={equipe.id} value={equipe.id}>{equipe.nom}</option>
                    ))}
                </select>

                <label>{langue.ajoutMatch.e2}</label>
                <select
                    value={equipe2}
                    onChange={(e) => {
                        handleChangeDefault(e.target.value, setEquipe2);
                    }}
                    disabled={!jeu || !saison}
                >
                    <option value=''></option>
                    {equipes.filter(equipe => equipe.id != equipe1).map((equipe) => (
                        <option key={equipe.id} value={equipe.id}>{equipe.nom}</option>
                    ))}
                </select>

                <label>{langue.ajoutMatch.s1}</label>
                <input
                    type='number'
                    value={scoreEquipe1}
                    onChange={(e) => {
                        handleChangeDefault(e.target.value, setScoreEquipe1);
                    }}
                />

                <label>{langue.ajoutMatch.s2}</label>
                <input
                    type='number'
                    value={scoreEquipe2}
                    onChange={(e) => {
                        handleChangeDefault(e.target.value, setScoreEquipe2);
                    }}
                />

                <label>{langue.date_heure}</label>
                <input
                    type="datetime-local"
                    value={datetime}
                    onChange={(e) => {
                        handleChangeDefault(e.target.value, setDatetime);
                    }}
                />

                <button onClick={creerMatch}
                    disabled={
                        equipe1 === '' ||
                        equipe2 === '' ||
                        scoreEquipe1 === '' ||
                        scoreEquipe2 === '' ||
                        datetime === ''
                    }
                >{langue.ajoutMatch.creer}</button>

                <p className='erreur'>{creerMatchStatusErreur}</p>
                <p className='succes'>{creerMatchStatusSucces}</p>
            </div>
        </div>
    );
}

export default AjoutMatchs;
