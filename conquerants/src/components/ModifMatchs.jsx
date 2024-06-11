import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "../styles/Admin.css";
import Loading from './Loading';

function ModifMatchs({ langue }) {
    const [saisonSelectionne, setSaisonSelectionne] = useState('');
    const [jeuSelectionne, setJeuSelectionne] = useState('');
    const [equipeSelectionne, setEquipeSelectionne] = useState('');
    const [matchSelectionne, setMatchSelectionne] = useState('');

    const [equipe1, setEquipe1] = useState('');
    const [equipe2, setEquipe2] = useState('');
    const [scoreEquipe1, setScoreEquipe1] = useState('');
    const [scoreEquipe2, setScoreEquipe2] = useState('');
    const [jouer, setJouer] = useState('');
    const [datetime, setDatetime] = useState('');

    const [datetimeDefault, setDatetimeDefault] = useState('');

    const [jeux, setJeux] = useState([]);
    const [saisons, setSaisons] = useState([]);
    const [equipes, setEquipes] = useState([]);
    const [matchs, setMatchs] = useState([]);
    const [matchChoisi, setMatchChoisi] = useState([]);

    const [modifMatchStatusErreur, setModifMatchStatusErreur] = useState('');
    const [modifMatchStatusSucces, setModifMatchStatusSucces] = useState('');

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
            if (jeuSelectionne && saisonSelectionne) {
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/equipeParJeu', { jeu: jeuSelectionne, saison: saisonSelectionne }, { withCredentials: true }
                    );
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
    }, [jeuSelectionne, saisonSelectionne]);

    // Dynamic Matchs
    useEffect(() => {
        const fetchMatchs = async () => {
            if (equipeSelectionne) {
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/matchParEquipe', { id_equipe: equipeSelectionne }, { withCredentials: true }
                    );
                    setMatchs(response.data);
                } catch (error) {
                    console.error('Error fetching matchs:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setMatchs([]);
            }
        };

        fetchMatchs();
    }, [equipeSelectionne]);

    // Match Choisi
    useEffect(() => {
        const fetchMatchChoisi = async () => {
            if (matchSelectionne) {
                ;
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/matchParId', { id_match: matchSelectionne }, { withCredentials: true }
                    );
                    setMatchChoisi(response.data);
                    setDatetimeDefault(formatDateTimeUTC(response.data.date_match))
                } catch (error) {
                    console.error('Error fetching match:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setMatchChoisi([]);
            }
        };

        fetchMatchChoisi();
    }, [matchSelectionne]);

    const formatDateTimeUTC = (dateString) => {
        const date = new Date(dateString);

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const modifierMatch = () => {
        resetStatusMessages();
        setLoading(true);
        
        Axios.put('https://conquerants.azurewebsites.net/admin/modifierMatch', {
            id_match: matchChoisi.id,
            id_equipe1: equipe1 === '' ? matchChoisi.equipe1.id : equipe1,
            id_equipe2: equipe2 === '' ? matchChoisi.equipe2.id : equipe2,
            date: datetime === '' ? formatDateTimeUTC(matchChoisi.date_match) : datetime,
            score1: scoreEquipe1 === '' ? matchChoisi.score1 : scoreEquipe1,
            score2: scoreEquipe2 === '' ? matchChoisi.score2 : scoreEquipe2,
            jouer: jouer === '' ? matchChoisi.jouer : jouer
            
        }, { withCredentials: true }).then((response) => {
            setModifMatchStatusSucces(response.data);
            setMatchSelectionne('');
        }).catch((error) => {
            setModifMatchStatusErreur(error.response);
        }).finally(() => {
            setLoading(false);
        });
    };

    const resetStatusMessages = () => {
        setModifMatchStatusErreur('');
        setModifMatchStatusSucces('');
    };
    const handleChangeDefault = (value, setter) => {
        setter(value);
    };

    const resetJoueurChoisi = () => {
        setEquipe1('');
        setEquipe2('');
        setScoreEquipe1('');
        setScoreEquipe2('');
        setDatetime('');
        setJouer('');
    }

    const handleChangeSaisonAndJeu = (value, setter) => {
        setEquipeSelectionne('')
        setMatchSelectionne('');

        setter(value);
    };

    const handleChangeEquipe = (value, setter) => {
        setMatchSelectionne('');
        setter(value);
    };

    const handleChangeMatch = (value, setter) => {
        resetJoueurChoisi();
        setModifMatchStatusErreur('');
        setModifMatchStatusSucces('');

        setter(value);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='App'>
            <div className='modifMatch'>
                <h2>{langue.modif_matchs.h2}</h2>

                <h1>{langue.modif_matchs.recherche}</h1>
                <label>{langue.modif_matchs.saison}</label>
                <select
                    value={saisonSelectionne}
                    onChange={(e) => handleChangeSaisonAndJeu(e.target.value, setSaisonSelectionne)}
                >
                    <option value=''></option>
                    {saisons.map((saison) => (
                        <option key={saison.id} value={saison.debut}>{saison.debut}-{saison.fin}</option>
                    ))}
                </select>

                <label>{langue.modif_matchs.jeu}</label>
                <select
                    value={jeuSelectionne}
                    onChange={(e) => handleChangeSaisonAndJeu(e.target.value, setJeuSelectionne)}
                >
                    <option value=''></option>
                    {jeux.map((jeu) => (
                        <option key={jeu.id} value={jeu.nom}>{jeu.nom}</option>
                    ))}
                </select>

                <label>{langue.modif_matchs.equipe}</label>
                <select
                    value={equipeSelectionne}
                    onChange={(e) => handleChangeEquipe(e.target.value, setEquipeSelectionne)}
                    disabled={!jeuSelectionne || !saisonSelectionne}
                >
                    <option value=''></option>
                    {equipes.map((equipe) => (
                        <option key={equipe.id} value={equipe.id}>{equipe.nom}</option>
                    ))}
                </select>

                <label>{langue.modif_matchs.matchs}</label>
                <select
                    value={matchSelectionne}
                    onChange={(e) => handleChangeMatch(e.target.value, setMatchSelectionne)}
                    disabled={!equipeSelectionne}
                >
                    <option value=''></option>
                    {matchs.map((match) => (
                        <option key={match.id} value={match.id}>{formatDateTimeUTC(match.date_match)}</option>
                    ))}
                </select>

                <p className='succes'>{modifMatchStatusSucces}</p>

                {matchSelectionne && (
                    <div className='modifMatch'>
                        <h1>{langue.modif_matchs.choix}</h1>
                        <h2>{langue.modif_matchs.match_h2}</h2>

                        <label>{langue.modif_matchs.id}</label>
                        <input
                            value={matchChoisi.id}
                            type='number'
                            disabled={true}
                        />

                        <label>{langue.modif_matchs.equipe1}</label>
                        <select
                            onChange={(e) => {
                                handleChangeDefault(e.target.value, setEquipe1);
                            }}
                            disabled={!jeuSelectionne || !saisonSelectionne}
                        >
                            {matchChoisi.equipe1 && (
                                <option value={matchChoisi.equipe1.id}>
                                    {matchChoisi.equipe1.nom}
                                </option>
                            )}
                            {equipes
                                .filter(equipe => equipe.id != (matchChoisi.equipe2 ? matchChoisi.equipe2.id : '') && equipe.id != (matchChoisi.equipe1 ? matchChoisi.equipe1.id : ''))
                                .map((equipe) => (
                                    <option key={equipe.id} value={equipe.id}>
                                        {equipe.nom}
                                    </option>
                                ))
                            }
                        </select>


                        <label>{langue.modif_matchs.equipe2}</label>
                        <select
                            onChange={(e) => {
                                handleChangeDefault(e.target.value, setEquipe2);
                            }}
                            disabled={!jeuSelectionne || !saisonSelectionne}
                        >
                            {matchChoisi.equipe2 && (
                                <option value={matchChoisi.equipe2.id}>
                                    {matchChoisi.equipe2.nom}
                                </option>
                            )}
                            {equipes
                                .filter(equipe => equipe.id != (matchChoisi.equipe1 ? matchChoisi.equipe1.id : '') && equipe.id != (matchChoisi.equipe2 ? matchChoisi.equipe2.id : ''))
                                .map((equipe) => (
                                    <option key={equipe.id} value={equipe.id}>
                                        {equipe.nom}
                                    </option>
                                ))
                            }
                        </select>


                        <label>{langue.modif_matchs.score1}</label>
                        <input
                            type='number'
                            defaultValue={matchChoisi.score1}
                            onChange={(e) => {
                                handleChangeDefault(e.target.value, setScoreEquipe1);
                            }}
                        />

                        <label>{langue.modif_matchs.score2}</label>
                        <input
                            type='number'
                            defaultValue={matchChoisi.score2}
                            onChange={(e) => {
                                handleChangeDefault(e.target.value, setScoreEquipe2);
                            }}
                        />

                        <label>{langue.modif_matchs.date_heure}</label>
                        <input
                            type="datetime-local"
                            defaultValue={datetimeDefault}
                            onChange={(e) => {
                                handleChangeDefault(e.target.value, setDatetime);
                            }}
                        />

                        <label>{langue.modif_matchs.jouer}</label>
                        <select
                            onChange={(e) => {
                                handleChangeDefault(e.target.value, setJouer);
                            }}
                        >
                            {matchChoisi.jouer === false ? (
                                <>
                                    <option value={false}>{langue.modif_matchs.non}</option>
                                    <option value={true}>{langue.modif_matchs.oui}</option>
                                </>
                            ) : (
                                <>
                                    <option value={true}>{langue.modif_matchs.oui}</option>
                                    <option value={false}>{langue.modif_matchs.non}</option>
                                </>
                            )}
                        </select>

                        <button
                            onClick={modifierMatch}
                            disabled={
                                (equipe1 === '' || equipe1 == matchChoisi.equipe1.id) &&
                                (equipe2 === '' || equipe2 == matchChoisi.equipe2.id) &&
                                (datetime === '' || formatDateTime(datetime) == formatDateTimeUTC(matchChoisi.date_match)) &&
                                (scoreEquipe1 === '' || scoreEquipe1 == matchChoisi.score1) &&
                                (scoreEquipe2 === '' || scoreEquipe2 == matchChoisi.score2) &&
                                (jouer === '' || jouer === matchChoisi.jouer.toString())
                            }
                        >
                            {langue.modif_matchs.modif}
                        </button>

                        <p className='erreur'>{modifMatchStatusErreur}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ModifMatchs;