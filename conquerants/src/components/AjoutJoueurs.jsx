import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "../styles/Admin.css";
import Loading from './Loading';

function AjoutJoueurs({ langue }) {
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [jeu, setJeu] = useState('');
    const [saison, setSaison] = useState('');
    const [position, setPosition] = useState('');
    const [equipe, setEquipe] = useState('');

    const [jeux, setJeux] = useState([]);
    const [saisons, setSaisons] = useState([]);
    const [positions, setPositions] = useState([]);
    const [equipes, setEquipes] = useState([]);

    const [creerJoueurStatusErreur, setCreerJoueurStatusErreur] = useState('');
    const [creerJoueurStatusSucces, setCreerJoueurStatusSucces] = useState('');

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

    // Dynamic Positions
    useEffect(() => {
        const fetchPositions = async () => {
            if (jeu) {
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/positionParJeu', { jeu }, { withCredentials: true }
                    );
                    setPositions(response.data);
                } catch (error) {
                    console.error('Error fetching positions:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setPositions([]);
            }
        };

        fetchPositions();
    }, [jeu]);

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

    const creerJoueur = () => {
        resetStatusMessages();
        setLoading(true);

        Axios.post('https://conquerants.azurewebsites.net/admin/creerJoueur', {
            prenom,
            nom,
            pseudo,
            date_naissance: dateNaissance,
            jeu,
            saison,
            position,
            equipe
        }, { withCredentials: true }
        ).then((response) => {
            setCreerJoueurStatusSucces(response.data);
            resetValues();
        }).catch((error) => {
            setCreerJoueurStatusErreur(error.response.data);
        }).finally(() => {
            setLoading(false);
        });
    };

    const resetValues = () => {
        setPrenom('');
        setNom('');
        setPseudo('');
        setDateNaissance('');
        setSaison('');
        setJeu('');
        setPosition('');
        setEquipe('');
    };

    const resetStatusMessages = () => {
        setCreerJoueurStatusErreur('');
        setCreerJoueurStatusSucces('');
    };

    const handleChangeNoSpace = (value, setter) => {
        if (/\s/g.test(value)) {
            return;
        }
        setter(value);
    };

    const handleChangeDefault = (value, setter) => {
        setter(value);
    };

    const handleChangeJeu = (value, setter) => {
        setEquipe('');
        setPosition('');

        if (value === "Rocket League") {
            setPosition(null);
        }

        setter(value);
    };

    const handleChangeSaison = (value, setter) => {
        setEquipe('');
        setPosition('');

        setter(value);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='App'>
            <div className='ajoutJoueurs'>
                <h2>{langue.ajoutJoueur.h2}</h2>

                <label>{langue.prenom}</label>
                <input
                    type='text'
                    value={prenom}
                    onChange={(e) => handleChangeNoSpace(e.target.value, setPrenom)}
                />

                <label>{langue.nom}</label>
                <input
                    type='text'
                    value={nom}
                    onChange={(e) => handleChangeNoSpace(e.target.value, setNom)}
                />

                <label>{langue.pseudo}</label>
                <input
                    type='text'
                    value={pseudo}
                    onChange={(e) => handleChangeNoSpace(e.target.value, setPseudo)}
                />

                <label>{langue.date_naissance}</label>
                <input
                    type='date'
                    value={dateNaissance}
                    onChange={(e) => handleChangeDefault(e.target.value, setDateNaissance)}
                />

                <label>{langue.saison}</label>
                <select
                    value={saison}
                    onChange={(e) => handleChangeSaison(e.target.value, setSaison)}
                >
                    <option value=''></option>
                    {saisons.map((saison) => (
                        <option key={saison.id} value={saison.debut}>{saison.debut}-{saison.fin}</option>
                    ))}
                </select>

                <label>{langue.jeu}</label>
                <select
                    value={jeu}
                    onChange={(e) => handleChangeJeu(e.target.value, setJeu)}
                >
                    <option value=''></option>
                    {jeux.map((jeu) => (
                        <option key={jeu.id} value={jeu.nom}>{jeu.nom}</option>
                    ))}
                </select>

                {jeu !== "Rocket League" && (
                    <div className='ajoutMatchs'>
                        <label>{langue.position}</label>
                        <select
                            value={position}
                            onChange={(e) => handleChangeDefault(e.target.value, setPosition)}
                            disabled={!jeu}
                        >
                            <option value=''></option>
                            {positions.map((position) => (
                                <option key={position.id} value={position.nom}>{position.nom}</option>
                            ))}
                        </select>
                    </div>
                )}

                <label>{langue.equipe}</label>
                <select
                    value={equipe}
                    onChange={(e) => handleChangeDefault(e.target.value, setEquipe)}
                    disabled={!jeu || !saison}
                >
                    <option value=''></option>
                    {equipes.map((equipe) => (
                        <option key={equipe.id} value={equipe.id}>{equipe.nom}</option>
                    ))}
                </select>

                <button
                    onClick={creerJoueur}
                    disabled={
                        nom === '' ||
                        prenom === '' ||
                        pseudo === '' ||
                        dateNaissance === '' ||
                        jeu === '' ||
                        saison === '' ||
                        (jeu !== "Rocket League" && position === '') ||
                        equipe === ''
                    }
                >
                    {langue.ajoutJoueur.creer}
                </button>

                <p className='erreur'>{creerJoueurStatusErreur}</p>
                <p className='succes'>{creerJoueurStatusSucces}</p>
            </div>
        </div>
    );
}

export default AjoutJoueurs;
