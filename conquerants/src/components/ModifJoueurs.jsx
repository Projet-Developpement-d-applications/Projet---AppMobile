import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "../styles/Admin.css";
import Loading from './Loading';

function ModifJoueurs({ langue }) {
    const [saisonSelectionne, setSaisonSelectionne] = useState('');
    const [jeuSelectionne, setJeuSelectionne] = useState('');
    const [equipeSelectionne, setEquipeSelectionne] = useState('');
    const [pseudoSelectionne, setPseudoSelectionne] = useState('');

    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [position, setPosition] = useState('');
    const [equipe, setEquipe] = useState('');

    const [prenomTemp, setPrenomTemp] = useState('');
    const [nomTemp, setNomTemp] = useState('');
    const [pseudoTemp, setPseudoTemp] = useState('');
    const [dateNaissanceDefault, setDateNaissanceDefault] = useState('');

    const [jeux, setJeux] = useState([]);
    const [saisons, setSaisons] = useState([]);
    const [equipes, setEquipes] = useState([]);
    const [pseudos, setPseudos] = useState([]);
    const [joueurChoisi, setJoueurChoisi] = useState([]);
    const [positions, setPositions] = useState([]);

    const [modifJoueurStatusErreur, setModifJoueurStatusErreur] = useState('');
    const [modifJoueurStatusSucces, setModifJoueurStatusSucces] = useState('');

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

    // Dynamic Pseudos
    useEffect(() => {
        const fetchPseudos = async () => {
            if (jeuSelectionne && saisonSelectionne && equipeSelectionne) {
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/joueurParEquipe', { jeu: jeuSelectionne, saison: saisonSelectionne, equipe: equipeSelectionne }, { withCredentials: true }
                    );
                    setPseudos(response.data);
                } catch (error) {
                    console.error('Error fetching pseudos:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setPseudos([]);
            }
        };

        fetchPseudos();
    }, [jeuSelectionne, saisonSelectionne, equipeSelectionne]);

    // Dynamic Positions
    useEffect(() => {
        const fetchPositions = async () => {
            if (joueurChoisi.jeu) {
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/positionParJeu', { jeu: joueurChoisi.jeu }, { withCredentials: true }
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
    }, [joueurChoisi.jeu]);

    // Joueur Choisi
    useEffect(() => {
        const fetchJoueurChoisi = async () => {
            if (pseudoSelectionne && jeuSelectionne && saisonSelectionne) {
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/noAuth/joueurParPseudo', { pseudo: pseudoSelectionne, jeu: jeuSelectionne, saison: saisonSelectionne });
                    setJoueurChoisi(response.data);
                    setPrenomTemp(response.data.prenom);
                    setNomTemp(response.data.nom);
                    setPseudoTemp(response.data.pseudo);
                    setDateNaissanceDefault(response.data.date_naissance.split('T')[0]);
                } catch (error) {
                    console.error('Error fetching player:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setJoueurChoisi([]);
            }
        };

        fetchJoueurChoisi();
    }, [jeuSelectionne, saisonSelectionne, pseudoSelectionne]);

    const modifierEquipe = () => {
        resetStatusMessages();
        setLoading(true);

        Axios.put('https://conquerants.azurewebsites.net/admin/modifierJoueur', {
            id: joueurChoisi.id,
            prenom: prenom === '' ? joueurChoisi.prenom : prenom,
            nom: nom === '' ? joueurChoisi.nom : nom,
            pseudo: pseudo === '' ? joueurChoisi.pseudo : pseudo,
            date_naissance: dateNaissance === '' ? joueurChoisi.date_naissance.split('T')[0] : dateNaissance,
            position: position === '' ? joueurChoisi.position : position,
            equipe: equipe === '' ? joueurChoisi.equipe.id : equipe,
            jeu: joueurChoisi.jeu,
            saison: joueurChoisi.saison.debut
        }, {
            withCredentials: true
        }).then((response) => {
            setModifJoueurStatusSucces(response.data);
            setPseudoSelectionne('');
        }).catch((error) => {
            setModifJoueurStatusErreur(error.response.data);
        }).finally(() => {
            setLoading(false);
        });
    };

    const resetStatusMessages = () => {
        setModifJoueurStatusErreur('');
        setModifJoueurStatusErreur('');
    };

    const handleChangeNoSpace = (value, setter, setterTemp) => {
        if (/\s/g.test(value)) {
            return;
        }
        setter(value);
        setterTemp(value);
    };

    const handleChangeDefault = (value, setter) => {
        setter(value);
    };

    const resetJoueurChoisi = () => {
        setPrenom('');
        setNom('');
        setPseudo('');
        setDateNaissance('');
        setPosition('');
        setEquipe('');
    }

    const handleChangeSaison = (value, setter) => {
        setEquipeSelectionne('')
        setPseudoSelectionne('');

        setter(value);
    };

    const handleChangeJeu = (value, setter) => {
        setEquipeSelectionne('')
        setPseudoSelectionne('');

        if (value === "Rocket League") {
            setPosition(null);
        }

        setter(value);
    };

    const handleChangeEquipe = (value, setter) => {
        setPseudoSelectionne('');

        setter(value);
    };

    const handleChangePseudo = (value, setter) => {
        resetJoueurChoisi();

        setter(value);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='App'>
            <div className='modifJoueur'>
                <h2>{langue.modif_joueurs.h2}</h2>

                <h1>{langue.modif_joueurs.recherche}</h1>
                <label>{langue.modif_joueurs.saison}</label>
                <select
                    value={saisonSelectionne}
                    onChange={(e) => handleChangeSaison(e.target.value, setSaisonSelectionne)}
                >
                    <option value=''></option>
                    {saisons.map((saison) => (
                        <option key={saison.id} value={saison.debut}>{saison.debut}-{saison.fin}</option>
                    ))}
                </select>

                <label>{langue.modif_joueurs.jeu}</label>
                <select
                    value={jeuSelectionne}
                    onChange={(e) => handleChangeJeu(e.target.value, setJeuSelectionne)}
                >
                    <option value=''></option>
                    {jeux.map((jeu) => (
                        <option key={jeu.id} value={jeu.nom}>{jeu.nom}</option>
                    ))}
                </select>

                <label>{langue.modif_joueurs.equipe}</label>
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

                <label>{langue.modif_joueurs.pseudo}</label>
                <select
                    value={pseudoSelectionne}
                    onChange={(e) => handleChangePseudo(e.target.value, setPseudoSelectionne)}
                    disabled={!equipeSelectionne}
                >
                    <option value=''></option>
                    {pseudos.map((pseudo) => (
                        <option key={pseudo.id} value={pseudo.pseudo}>{pseudo.pseudo}</option>
                    ))}
                </select>

                <p className='succes'>{modifJoueurStatusSucces}</p>

                {pseudoSelectionne && (
                    <div className='modifJoueur'>
                        <h1>{langue.modif_joueurs.choix}</h1>
                        <h2>{langue.modif_joueurs.joueur_h2}</h2>
                        <label>{langue.modif_joueurs.id}</label>
                        <input
                            value={joueurChoisi.id}
                            type='number'
                            disabled={true}
                        />

                        <label>{langue.prenom}</label>
                        <input
                            type='text'
                            value={prenom === '' ? prenomTemp : prenom}
                            onChange={(e) => handleChangeNoSpace(e.target.value, setPrenom, setPrenomTemp)}
                        />

                        <label>{langue.nom}</label>
                        <input
                            type='text'
                            value={nom === '' ? nomTemp : nom}
                            onChange={(e) => handleChangeNoSpace(e.target.value, setNom, setNomTemp)}
                        />

                        <label>{langue.pseudo}</label>
                        <input
                            type='text'
                            value={pseudo === '' ? pseudoTemp : pseudo}
                            onChange={(e) => handleChangeNoSpace(e.target.value, setPseudo, setPseudoTemp)}
                        />

                        <label>{langue.date_naissance}</label>
                        <input
                            type='date'
                            defaultValue={dateNaissanceDefault}
                            onChange={(e) => handleChangeDefault(e.target.value, setDateNaissance)}
                        />

                        {joueurChoisi.jeu !== "Rocket League" && (
                            <div className='modifJoueur'>
                                <label>{langue.position}</label>
                                <select
                                    value={position}
                                    onChange={(e) => handleChangeDefault(e.target.value, setPosition)}
                                >
                                    <option value={joueurChoisi.position ? joueurChoisi.position : ''}>
                                        {joueurChoisi.position ? joueurChoisi.position : ''}
                                    </option>
                                    {positions
                                        .filter((pos) => pos.nom !== joueurChoisi.position)
                                        .map((pos) => (
                                            <option key={pos.id} value={pos.nom}>
                                                {pos.nom}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        <label>{langue.equipe}</label>
                        <select
                            value={equipe}
                            onChange={(e) => handleChangeDefault(e.target.value, setEquipe)}
                            disabled={!joueurChoisi}
                        >
                            <option value={joueurChoisi.equipe ? joueurChoisi.equipe.id : ''}>
                                {joueurChoisi.equipe ? joueurChoisi.equipe.nom : ''}
                            </option>
                            {equipes
                                .filter((equipe) => !joueurChoisi.equipe || equipe.id !== joueurChoisi.equipe.id)
                                .map((equipe) => (
                                    <option key={equipe.id} value={equipe.id}>
                                        {equipe.nom}
                                    </option>
                                ))}
                        </select>


                        <button
                            onClick={modifierEquipe}
                            disabled={
                                (prenom === '' || prenom === joueurChoisi.prenom) &&
                                (nom === '' || nom === joueurChoisi.nom) &&
                                (pseudo === '' || pseudo === joueurChoisi.pseudo) &&
                                (dateNaissance === '' || dateNaissance === joueurChoisi.date_naissance.split('T')[0]) &&
                                (position === '' || position === joueurChoisi.position) &&
                                (equipe === '' || equipe == joueurChoisi.equipe.id)
                            }
                        >
                            {langue.modif_joueurs.modif}
                        </button>

                        <p className='erreur'>{modifJoueurStatusErreur}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ModifJoueurs;