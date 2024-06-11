import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "../styles/Admin.css";
import Loading from './Loading';

function ModifEquipes({ langue }) {
    const [saisonSelectionne, setSaisonSelectionne] = useState('');
    const [jeuSelectionne, setJeuSelectionne] = useState('');
    const [equipeSelectionne, setEquipeSelectionne] = useState('');

    const [nom, setNom] = useState('');
    const [division, setDivision] = useState('');

    const [nomTemp, setNomTemp] = useState('');

    const [jeux, setJeux] = useState([]);
    const [saisons, setSaisons] = useState([]);
    const [equipes, setEquipes] = useState([]);
    const [equipeChoisie, setEquipeChoisie] = useState([]);

    const [modifEquipStatusErreur, setModifEquipStatusErreur] = useState('');
    const [modifEquipStatusSucces, setModifEquipStatusSucces] = useState('');

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

    useEffect(() => {
        const fetchEquipeChoisie = async () => {
            if (equipeSelectionne && jeuSelectionne && saisonSelectionne) {
                setLoading(true);
                try {
                    const response = await Axios.post('https://conquerants.azurewebsites.net/equipeParNom', { jeu: jeuSelectionne, saison: saisonSelectionne, nom: equipeSelectionne }, { withCredentials: true }
                    );
                    setEquipeChoisie(response.data);
                    setNomTemp(response.data.nom);
                } catch (error) {
                    console.error('Error fetching team:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setEquipeChoisie([]);
            }
        };

        fetchEquipeChoisie();
    }, [jeuSelectionne, saisonSelectionne, equipeSelectionne]);

    const modifierEquipe = () => {
        resetStatusMessages();
        setLoading(true);

        Axios.put('https://conquerants.azurewebsites.net/admin/modifierEquipe', {
            id: equipeChoisie.id,
            nom: nom === '' ? equipeChoisie.nom : nom,
            division: division === '' ? equipeChoisie.division : division,
            jeu: equipeChoisie.jeu,
            saison: equipeChoisie.saison.debut
        }, { withCredentials: true }
        ).then((response) => {
            setModifEquipStatusSucces(response.data);
            setEquipeSelectionne('');
        }).catch((error) => {
            setModifEquipStatusErreur(error.response.data);
        }).finally(() => {
            setLoading(false);
        });
    };

    const resetStatusMessages = () => {
        setModifEquipStatusErreur('');
        setModifEquipStatusSucces('');
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

    const handleChangeSaisonAndJeu = (value, setter) => {
        setEquipeSelectionne('')
        setNom('');
        setter(value);
    };

    const handleChangeEquipe = (value, setter) => {
        setNom('');
        setModifEquipStatusSucces('');
        setModifEquipStatusErreur('');
        resetEquipeChoisi();
        setter(value);
    };

    const resetEquipeChoisi = () => {
        setNom('');
        setDivision('');
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='App'>
            <div className='modifEquipe'>
                <h2>{langue.modif_equipes.h2}</h2>

                <h1>{langue.modif_equipes.recherche}</h1>
                <label>{langue.modif_equipes.saison}</label>
                <select
                    value={saisonSelectionne}
                    onChange={(e) => handleChangeSaisonAndJeu(e.target.value, setSaisonSelectionne)}
                >
                    <option value=''></option>
                    {saisons.map((saison) => (
                        <option key={saison.id} value={saison.debut}>{saison.debut}-{saison.fin}</option>
                    ))}
                </select>

                <label>{langue.modif_equipes.jeu}</label>
                <select
                    value={jeuSelectionne}
                    onChange={(e) => handleChangeSaisonAndJeu(e.target.value, setJeuSelectionne)}
                >
                    <option value=''></option>
                    {jeux.map((jeu) => (
                        <option key={jeu.id} value={jeu.nom}>{jeu.nom}</option>
                    ))}
                </select>

                <label>{langue.modif_equipes.equipe}</label>
                <select
                    value={equipeSelectionne}
                    onChange={(e) => handleChangeEquipe(e.target.value, setEquipeSelectionne)}
                    disabled={!jeuSelectionne || !saisonSelectionne}
                >
                    <option value=''></option>
                    {equipes.map((equipe) => (
                        <option key={equipe.id} value={equipe.nom}>{equipe.nom}</option>
                    ))}
                </select>

                <p className='succes'>{modifEquipStatusSucces}</p>

                {equipeSelectionne && (
                    <div className='modifEquipe'>
                        <h1>{langue.modif_equipes.choix}</h1>
                        <h2>{langue.modif_equipes.equipe_h2}</h2>
                        <label>{langue.modif_equipes.id}</label>
                        <input
                            value={equipeChoisie.id}
                            type='number'
                            disabled={true}
                        />

                        <label>{langue.nom}</label>
                        <input
                            type='text'
                            value={nom === '' ? nomTemp : nom}
                            onChange={(e) => handleChangeNoSpace(e.target.value, setNom, setNomTemp)}
                            disabled={!equipeSelectionne}
                        />

                        <label>Division</label>
                        <input
                            type='number'
                            defaultValue={equipeChoisie.division}
                            onChange={(e) => handleChangeDefault(e.target.value, setDivision)}
                            disabled={!equipeSelectionne}
                        />

                        <button
                            onClick={modifierEquipe}
                            disabled={
                                (nom === '' || nom === equipeChoisie.nom) &&
                                (division === '' || division == equipeChoisie.division)
                            }
                        >
                            {langue.modif_equipes.modif}
                        </button>

                        <p className='erreur'>{modifEquipStatusErreur}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ModifEquipes;
