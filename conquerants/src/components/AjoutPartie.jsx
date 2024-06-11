import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "../styles/Admin.css";
import Loading from './Loading';
import { Table } from "react-bootstrap";

function AjoutPartie({ langue, langueStat }) {
    const [saisonSelectionne, setSaisonSelectionne] = useState('');
    const [jeuSelectionne, setJeuSelectionne] = useState('');
    const [equipeSelectionne, setEquipeSelectionne] = useState('');
    const [matchSelectionne, setMatchSelectionne] = useState('');

    const [scoreEquipe1, setScoreEquipe1] = useState('');
    const [scoreEquipe2, setScoreEquipe2] = useState('');

    const [jeux, setJeux] = useState([]);
    const [saisons, setSaisons] = useState([]);
    const [equipes, setEquipes] = useState([]);
    const [matchs, setMatchs] = useState([]);
    const [pseudosEquipe1, setPseudosEquipe1] = useState([]);
    const [pseudosEquipe2, setPseudosEquipe2] = useState([]);
    const [matchChoisi, setMatchChoisi] = useState([]);

    const [stats, setStats] = useState([]);
    const [statsGeneration, setStatsGeneration] = useState([]);
    const [statsJoueur, setStatsJoueur] = useState([]);

    const [ajoutPartieStatusErreur, setAjoutPartieStatusErreur] = useState('');
    const [ajoutPartieStatusSucces, setAjoutPartieStatusSucces] = useState('');

    const [loading, setLoading] = useState(true);

    Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    // Dynamic Jeux et Saisons
    useEffect(() => {
        const fetchData = async () => {
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
                    const response = await Axios.post('https://conquerants.azurewebsites.net/equipeParJeu', { jeu: jeuSelectionne, saison: saisonSelectionne }, { withCredentials: true });
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
                    const response = await Axios.post('https://conquerants.azurewebsites.net/matchParEquipe', { id_equipe: equipeSelectionne }, { withCredentials: true });
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
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/matchParId', { id_match: matchSelectionne }, { withCredentials: true });
                    setMatchChoisi(response.data);
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

    // Dynamic Pseudos pour Equipe 1
    useEffect(() => {
        const fetchPseudosEquipe1 = async () => {
            if (jeuSelectionne && saisonSelectionne && matchChoisi && matchChoisi.equipe1) {
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/joueurParEquipe', { jeu: jeuSelectionne, saison: saisonSelectionne, equipe: matchChoisi.equipe1.id }, { withCredentials: true });
                    setPseudosEquipe1(response.data);
                } catch (error) {
                    console.error('Error fetching pseudos:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setPseudosEquipe1([]);
            }
        };

        fetchPseudosEquipe1();
    }, [jeuSelectionne, saisonSelectionne, matchChoisi]);

    // Dynamic Pseudos pour Equipe 2
    useEffect(() => {
        const fetchPseudosEquipe2 = async () => {
            if (jeuSelectionne && saisonSelectionne && matchChoisi && matchChoisi.equipe2) {
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/joueurParEquipe', { jeu: jeuSelectionne, saison: saisonSelectionne, equipe: matchChoisi.equipe2.id }, { withCredentials: true });
                    setPseudosEquipe2(response.data);
                } catch (error) {
                    console.error('Error fetching pseudos:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setPseudosEquipe2([]);
            }
        };

        fetchPseudosEquipe2();
    }, [jeuSelectionne, saisonSelectionne, matchChoisi]);

    useEffect(() => {
        switch (jeuSelectionne) {
            case "Valorant":
                setStats(langue.valo.stats);
                setStatsGeneration(langueStat.valo.stats);
                break;

            case "League of Legends":
                setStats(langue.lol.stats);
                setStatsGeneration(langueStat.lol.stats);
                break;

            case "Rocket League":
                setStats(langue.rl.stats);
                setStatsGeneration(langueStat.rl.stats);
                break;
            default:
                break;
        }
    });

    // Dynamic statsJoueur array
    useEffect(() => {
        const initialStatsJoueur = [];

        for (let i = 0; i < pseudosEquipe1.length; i++) {
            initialStatsJoueur.push({
                stats: stats.reduce((acc, stat) => ({ ...acc, [stat]: 0 }), {}),
            });
        }

        for (let i = 0; i < pseudosEquipe2.length; i++) {
            initialStatsJoueur.push({
                stats: stats.reduce((acc, stat) => ({ ...acc, [stat]: 0 }), {}),
            });
        }

        setStatsJoueur(initialStatsJoueur);

    }, [pseudosEquipe1, pseudosEquipe2, stats]);

    const ajouterPartie = () => {
        resetStatusMessages();
        setLoading(true);

        Axios.post('https://conquerants.azurewebsites.net/admin/ajouterPartie', {
            id_match: matchChoisi.id,
            score1: scoreEquipe1,
            score2: scoreEquipe2
        }, { withCredentials: true }
        ).then((response) => {
            const partieID = response.data;
            generateJSON(partieID);
            setAjoutPartieStatusSucces(langue.ajoutPartie.succes);
            resetValues();
        }).catch((error) => {
            setAjoutPartieStatusErreur(error.response);
        }).finally(() => {
            setLoading(false);
        });
    };

    const formatDateTimeUTC = (dateString) => {
        const date = new Date(dateString);

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const resetStatusMessages = () => {
        setAjoutPartieStatusErreur('');
        setAjoutPartieStatusSucces('');
    };
    const handleChangeDefault = (value, setter) => {
        setter(value);
    };

    const resetValues = () => {
        setScoreEquipe1('');
        setScoreEquipe2('');
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
        resetValues();
        setAjoutPartieStatusErreur('');
        setAjoutPartieStatusSucces('');

        setter(value);
    };

    const generateJSON = async (partieID) => {
        const playersData = [];

        pseudosEquipe1.forEach((player, index) => {
            const playerData = {
                id: player.id,
                pseudo: player.pseudo,
                stats: {}
            };

            statsGeneration.forEach((stat, statIndex) => {
                const inputValue = statsJoueur[index]?.stats[statIndex] || 0;
                playerData.stats[stat] = inputValue;
            });

            playersData.push(playerData);
        });

        pseudosEquipe2.forEach((player, index) => {
            const playerData = {
                id: player.id,
                pseudo: player.pseudo,
                stats: {}
            };

            stats.forEach((stat, statIndex) => {
                const inputValue = statsJoueur[index + pseudosEquipe1.length]?.stats[statIndex] || 0;
                playerData.stats[stat] = inputValue;
            });

            playersData.push(playerData);
        });

        try {
            await Promise.all(playersData.filter((player) => player.stats["Victoire/Défaite"] !== 0).map(async (player) => {
                const playerData = {
                    donnee: JSON.stringify(player.stats),
                    pseudo: player.pseudo,
                    jeu: jeuSelectionne,
                    saison: saisonSelectionne,
                    id_partie: partieID
                };
    
                await Axios.post('https://conquerants.azurewebsites.net/admin/ajouterStatistique', playerData, { withCredentials: true });
            }));
    
            console.log('All player statistics saved successfully.');
        } catch (error) {
            console.error('Failed to save player statistics:', error);
        }
    };

    const updatePlayerStat = (index, statIndex, value) => {
        const updatedStats = [...statsJoueur];
        if (updatedStats[index]) {
            updatedStats[index].stats[statIndex] = value;
            setStatsJoueur(updatedStats);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='App'>
            <div className='ajoutPartie'>
                <h2>{langue.ajoutPartie.ajout}</h2>

                <h1>{langue.ajoutPartie.match}</h1>
                <label>{langue.ajoutPartie.saison_match}</label>
                <select
                    value={saisonSelectionne}
                    onChange={(e) => handleChangeSaisonAndJeu(e.target.value, setSaisonSelectionne)}
                >
                    <option value=''></option>
                    {saisons.map((saison) => (
                        <option key={saison.id} value={saison.debut}>{saison.debut}-{saison.fin}</option>
                    ))}
                </select>

                <label>{langue.ajoutPartie.jeu_match}</label>
                <select
                    value={jeuSelectionne}
                    onChange={(e) => handleChangeSaisonAndJeu(e.target.value, setJeuSelectionne)}
                >
                    <option value=''></option>
                    {jeux.map((jeu) => (
                        <option key={jeu.id} value={jeu.nom}>{jeu.nom}</option>
                    ))}
                </select>

                <label>{langue.ajoutPartie.equipe_match}</label>
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

                <label>{langue.ajoutPartie.match_equipe}</label>
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

                {matchSelectionne && (
                    <div className='ajoutPartie'>
                        <h1>{langue.ajoutPartie.creer}</h1>

                        <label>{langue.score} {matchChoisi && matchChoisi.equipe1 && matchChoisi.equipe1.nom}</label>
                        <input
                            type='number'
                            onChange={(e) => {
                                handleChangeDefault(e.target.value, setScoreEquipe1);
                            }}
                        />

                        <label>{langue.score} {matchChoisi && matchChoisi.equipe2 && matchChoisi.equipe2.nom}</label>
                        <input
                            type='number'
                            onChange={(e) => {
                                handleChangeDefault(e.target.value, setScoreEquipe2);
                            }}
                        />

                        <p className='succes'>{ajoutPartieStatusSucces}</p>
                        <p className='erreur'>{ajoutPartieStatusErreur}</p>

                        <Table striped className="joueurStats">
                            <thead>
                                <tr>
                                    <th>{langue.pseudo}</th>
                                    {stats.map((stat, index) => {
                                        return <th key={index}>{stat}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={stats.length + 1}>{matchChoisi && matchChoisi.equipe1 && matchChoisi.equipe1.nom}</td>
                                </tr>
                                {pseudosEquipe1.map((joueur, index) => (
                                    <tr key={index}>
                                        <td>{joueur.pseudo}</td>
                                        {stats.map((stat, statIndex) => (
                                            <td key={statIndex}>
                                                <input
                                                    value={statsJoueur[index]?.stats[statIndex]}
                                                    onChange={(e) => updatePlayerStat(index, statIndex, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                                <tr>
                                    <td colSpan={stats.length + 1}>{matchChoisi && matchChoisi.equipe2 && matchChoisi.equipe2.nom}</td>
                                </tr>

                                {pseudosEquipe2.map((joueur, index) => (
                                    <tr key={index}>
                                        <td>{joueur.pseudo}</td>
                                        {stats.map((stat, statIndex) => (
                                            <td key={statIndex}>
                                                <input
                                                    value={statsJoueur[index + pseudosEquipe1.length]?.stats[statIndex]}
                                                    onChange={(e) => updatePlayerStat(index + pseudosEquipe1.length, statIndex, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <button
                            onClick={ajouterPartie}
                            disabled={
                                scoreEquipe1 === '' ||
                                scoreEquipe2 === ''
                            }
                        >
                            {langue.ajoutPartie.confirm}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AjoutPartie;
