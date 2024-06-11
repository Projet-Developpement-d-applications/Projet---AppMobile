import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import Axios from 'axios';
import Loading from './Loading';
import Erreur from './Erreur';
import Saison from './Saison';
import '../styles/Joueurs.css';
import '../styles/Matchs.css';

function Matchs({ saisonFiltre, setSaisonFiltre, saisons, langue }) {

    const [equipes, setEquipes] = useState([]);
    const [matchs, setMatchs] = useState([]);
    const [jeux, setJeux] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(false);

    const [equipeFiltre, setEquipeFiltre] = useState({nom: ""});
    const [jeuFiltre, setJeuFiltre] = useState({nom: ""});
    const [equipe1Ascendant, setEquipe1Ascendant] = useState(true);
    const [equipe2Ascendant, setEquipe2Ascendant] = useState(true);
    const [dateAscendant, setDateAscendant] = useState(true);
    const [jeuAscendant, setJeuAscendant] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [jeuxResponse, equipesResponse, matchsResponse] = await Promise.all([
                    Axios.get('https://conquerants.azurewebsites.net/noAuth/jeux'),
                    Axios.get('https://conquerants.azurewebsites.net/noAuth/toutesEquipesLimoilou'),
                    Axios.get('https://conquerants.azurewebsites.net/noAuth/matchs')
                ]);
                setMatchs(matchsResponse.data);
                setupEquipes(equipesResponse.data, matchsResponse.data);
                setJeux(jeuxResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setErreur(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaison = (saison) => {
        setEquipeFiltre({nom: ""});
        setSaisonFiltre(saison);
    }

    const setupEquipes = (equipes, matchs) => {
        const toutesEquipes = [...new Set([...matchs.map(match => match.equipe1.id), ...matchs.map(match => match.equipe2.id)])];

        const equipesAvecMatchs = []

        equipes.map(equipe => {
            if (toutesEquipes.includes(equipe.id)) {
                equipesAvecMatchs.push(equipe);
            }
            return true;
        });

        setEquipes(equipesAvecMatchs);
    }

    const jeuMatch = (equipe) => {
        return jeuFiltre.nom === '' || equipe.jeu === jeuFiltre.nom;
    }

    const saisonMatch = (equipe) => {
        return saisonFiltre.debut === equipe.saison.debut;
    }

    const equipeMatch = (equipe) => {
        return equipeFiltre.nom === '' || equipe.id === equipeFiltre.id;
    }

    const trierEquipes = (setter, ascendant, value) => {
        setter(!ascendant);

        setMatchs(matchs.sort((m1, m2) => {
            const collator = new Intl.Collator(undefined, { sensitivity: 'base'});
            switch (value) {
                case "equipe1" :
                    return collator.compare(m1.equipe1.nom, m2.equipe1.nom) * (ascendant ? 1 : -1);
                case "equipe2" :
                    return collator.compare(m1.equipe2.nom, m2.equipe2.nom) * (ascendant ? 1 : -1);
                case "jeu" :
                    return collator.compare(m1.equipe1.jeu, m2.equipe1.jeu) * (ascendant ? 1 : -1);
                case "date" :
                    return collator.compare(m1.date_match, m2.date_match) * (ascendant ? 1 : -1);
                default:
                    return "";
            }
        }));
    }

    if (loading) {
        return <Loading/>
    }
    
    if (erreur) {
        return <Erreur/>
    }

    function formatDate(date) {
        const d = new Date(date);
      
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        const hours = String(d.getUTCHours()).padStart(2, '0');
        const minutes = String(d.getUTCMinutes()).padStart(2, '0');
      
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const filtrerMatchs = () => {
        return matchs.filter((match) => {
            return saisonMatch(match.equipe1) && jeuMatch(match.equipe1) && equipeMatch(match.equipe1);
        }).map((match, index) => {
            return <tr key={index}>
                <td>
                    {match.equipe1.nom}
                </td>
                <td>
                    {match.equipe2.nom}
                </td>
                <td>
                    {match.score1 + " - " + match.score2}
                </td>
                <td>
                    {match.equipe1.jeu}
                </td>
                <td>
                    {formatDate(match.date_match)}
                </td>
            </tr>
        });
    }

    var matchAffichage = filtrerMatchs();

    return (
        <div className='content'>
            <div className="rechercheContainer">
                <h1 className="titreJoueur">{langue.matchs.h1}</h1>
                <Selection langue={langue} saisons={saisons} setSaison={handleSaison} saison={saisonFiltre} jeux={jeux} setJeu={setJeuFiltre} equipes={equipes} 
                setEquipe={setEquipeFiltre} jeuMatch={jeuMatch} saisonMatch={saisonMatch}/>
            </div>
            <Table striped className="tableauJoueurs" id="tableauMatchs">
                <thead>
                    <tr>
                        <th onClick={() => trierEquipes(setEquipe1Ascendant, equipe1Ascendant, "equipe1")}>
                            {langue.matchs.e1}
                        </th>
                        <th onClick={() => trierEquipes(setEquipe2Ascendant, equipe2Ascendant, "equipe2")}>
                            {langue.matchs.e2}
                        </th>
                        <th>
                            {langue.score}
                        </th>
                        <th onClick={() => trierEquipes(setJeuAscendant, jeuAscendant, "jeu")}>
                            {langue.jeu}
                        </th>
                        <th onClick={() => trierEquipes(setDateAscendant, dateAscendant, "date")}>
                            {langue.date}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {matchAffichage.length > 0 ? matchAffichage :
                        <tr>
                            <td colSpan={5}>
                                {langue.matchs.aucun}
                            </td>
                        </tr>
                    }
                </tbody>
            </Table>
        </div>
    );
}

function Selection({saisons, setSaison, saison, jeux, setJeu, equipes, setEquipe, jeuMatch, saisonMatch, langue }) {

    const handleChange = (value, setter) =>  {
        var jeuTemp = {nom: ""};

        if (value !== "") {
            jeuTemp = JSON.parse(value);
        }

        setter(jeuTemp);
    }

    return (
        <div className="selection">
            <Saison nomClass="saisonJoueur" saisons={saisons} saison={saison} setSaison={setSaison}/>
            <select defaultValue="" onChange={(e) => handleChange(e.target.value, setJeu)}>
                <option value="">{langue.matchs.jeux}</option>
                {jeux.map((jeu, index) => (
                    <option key={index} value={JSON.stringify(jeu)}>
                        {jeu.nom}
                    </option>
                ))}
            </select>
            <select defaultValue="" onChange={(e) => handleChange(e.target.value, setEquipe)}>
                <option value="">{langue.matchs.equipes}</option>
                {equipes.filter((equipe) => {
                    return jeuMatch(equipe) && saisonMatch(equipe);
                }).map((equipe, index) => (
                    <option key={index} value={JSON.stringify(equipe)}>
                        {equipe.nom + " / " + equipe.jeu.substring(0, 3)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Matchs;