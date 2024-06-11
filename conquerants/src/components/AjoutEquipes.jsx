import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "../styles/Admin.css";
import Loading from './Loading';

function AjoutEquipes({ langue }) {
    const [nom, setNom] = useState('');
    const [division, setDivision] = useState('');
    const [jeu, setJeu] = useState('');
    const [saison, setSaison] = useState('');

    const [jeux, setJeux] = useState([]);
    const [saisons, setSaisons] = useState([]);

    const [creerEquipeStatusErreur, setCreerEquipeStatusErreur] = useState('');
    const [creerEquipeStatusSucces, setCreerEquipeStatusSucces] = useState('');

    const [loading, setLoading] = useState(true);

    Axios.defaults.baseURL = 'https://conquerants.azurewebsites.net';
    Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

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

    const creerEquipe = () => {
        resetStatusMessages();
        setLoading(true);

        Axios.post('https://conquerants.azurewebsites.net/admin/creerEquipe', {
            nom,
            division,
            jeu,
            saison
        }, { withCredentials: true }
        ).then((response) => {
            setCreerEquipeStatusSucces(response.data);
            resetValues();
        }).catch((error) => {
            setCreerEquipeStatusErreur(error.response.data);
        }).finally(() => {
            setLoading(false);
        });
    };

    const resetValues = () => {
        setNom('');
        setDivision('');
        setSaison('');
        setJeu('');
    };

    const resetStatusMessages = () => {
        setCreerEquipeStatusErreur('');
        setCreerEquipeStatusSucces('');
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

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='App'>
            <div className='ajoutEquipe'>
                <h2>{langue.ajoutEquipe.h2}</h2>

                <label>{langue.ajoutEquipe.nom_equipe}</label>
                <input
                    type='text'
                    value={nom}
                    onChange={(e) => handleChangeNoSpace(e.target.value, setNom)}
                />

                <label>{langue.division}</label>
                <input
                    type='number'
                    value={division}
                    onChange={(e) => handleChangeNoSpace(e.target.value, setDivision)}
                />

                <label>{langue.saison}</label>
                <select
                    value={saison}
                    onChange={(e) => handleChangeDefault(e.target.value, setSaison)}
                >
                    <option value=''></option>
                    {saisons.map((saison) => (
                        <option key={saison.id} value={saison.debut}>{saison.debut}-{saison.fin}</option>
                    ))}
                </select>

                <label>{langue.jeu}</label>
                <select
                    value={jeu}
                    onChange={(e) => handleChangeDefault(e.target.value, setJeu)}
                >
                    <option value=''></option>
                    {jeux.map((jeu) => (
                        <option key={jeu.id} value={jeu.nom}>{jeu.nom}</option>
                    ))}
                </select>

                <button onClick={creerEquipe} disabled={nom === '' || division === '' || jeu === '' || saison === ''}>{langue.ajoutEquipe.creer}</button>

                <p className='erreur'>{creerEquipeStatusErreur}</p>
                <p className='succes'>{creerEquipeStatusSucces}</p>
            </div>
        </div>
    );
}

export default AjoutEquipes;
