import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Saison from './Saison';
import Loading from './Loading';
import Erreur from './Erreur';
import '../styles/Joueurs.css';

function Joueurs({ saisonFiltre, setSaisonFiltre, saisons, langue }) {

    const [joueurs, setJoueurs] = useState([]);
    const [jeux, setJeux] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(false);

    const [recherche, setRecherche] = useState("");
    const [jeuFiltre, setJeuFiltre] = useState({nom: ""});
    const [nomAscendant, setNomAscendant] = useState(true);
    const [prenomAscendant, setPrenomAscendant] = useState(true);
    const [pseudoAscendant, setPseudoAscendant] = useState(true);
    const [jeuAscendant, setJeuAscendant] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [jeuxResponse, joueursResponse] = await Promise.all([
                    Axios.get('https://conquerants.azurewebsites.net/noAuth/jeux'),
                    Axios.get('https://conquerants.azurewebsites.net/noAuth/getAllJoueurs')
                ]);
                setJoueurs(joueursResponse.data);
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

    if (loading) {
        return <Loading/>
    }
    
    if (erreur) {
        return <Erreur/>
    }

    const jeuMatch = (joueur) => {
        return jeuFiltre.nom === '' || joueur.jeu === jeuFiltre.nom;
    }

    const saisonMatch = (joueur) => {
        return saisonFiltre.id === joueur.saison.id;
    }

    const rechercheMatch = (joueur) => {
        const value = recherche.toLowerCase();

        return value === '' ||
        joueur.pseudo.toLowerCase().includes(value) ||
        joueur.nom.toLowerCase().includes(value) ||
        joueur.prenom.toLowerCase().includes(value);
    }

    const trierJoueurs = (setter, ascendant, value) => {
        setter(!ascendant);

        setJoueurs(joueurs.sort((j1, j2) => {
            const collator = new Intl.Collator(undefined, { sensitivity: 'base'});
            switch (value) {
                case "nom" :
                    return collator.compare(j1.nom, j2.nom) * (ascendant ? 1 : -1);
                case "prenom" :
                    return collator.compare(j1.prenom, j2.prenom) * (ascendant ? 1 : -1);
                case "pseudo" :
                    return collator.compare(j1.pseudo, j2.pseudo) * (ascendant ? 1 : -1);
                case "jeu" :
                    return collator.compare(j1.jeu, j2.jeu) * (ascendant ? 1 : -1);
                default:
                    return "";
            }
        }));
    }

    const handleClick = (joueur) => {
        return navigate("/joueur/" + joueur.saison.debut + "/" + joueur.jeu + "/" + joueur.pseudo);
    }

    const filtrerJoueurs = () => {
        return joueurs.filter((joueur) => {
            return saisonMatch(joueur) && jeuMatch(joueur) && rechercheMatch(joueur);
        }).map((joueur, index) => {
            return <tr key={index} onClick={() => handleClick(joueur)}>
                <td>
                    {joueur.prenom}
                </td>
                <td>
                    {joueur.nom}
                </td>
                <td>
                    {joueur.pseudo}
                </td>
                <td>
                    {joueur.jeu}
                </td>
            </tr>
        });
    }

    var joueursAffichage = filtrerJoueurs();

    return (
        <div className='content'>
            <div className="rechercheContainer">
                <h1 className="titreJoueur">{langue.joueurs.h1}</h1>
                <Selection langue={langue} setRecherche={setRecherche} saisons={saisons} setSaison={setSaisonFiltre} saison={saisonFiltre} jeux={jeux} setJeu={setJeuFiltre} />
            </div>
            <Table striped className="tableauJoueurs">
                <thead>
                    <tr>
                        <th onClick={() => trierJoueurs(setPrenomAscendant, prenomAscendant, "prenom")}>
                            {langue.prenom}
                        </th>
                        <th onClick={() => trierJoueurs(setNomAscendant, nomAscendant, "nom")}>
                            {langue.nom}
                        </th>
                        <th onClick={() => trierJoueurs(setPseudoAscendant, pseudoAscendant, "pseudo")}>
                            {langue.pseudo}
                        </th>
                        <th onClick={() => trierJoueurs(setJeuAscendant, jeuAscendant, "jeu")}>
                            {langue.jeu}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {joueursAffichage.length > 0 ? joueursAffichage :
                        <tr>
                            <td colSpan={4}>
                                {langue.joueurs.aucun}
                            </td>
                        </tr>
                    }
                </tbody>
            </Table>
        </div>
    );
}

function Selection({ setRecherche, saisons, setSaison, saison, jeux, setJeu, langue }) {

    const handleChange = (value) =>  {
        var jeuTemp = {nom: ""};

        if (value !== "") {
            jeuTemp = JSON.parse(value);
        }

        setJeu(jeuTemp);
    }

    return (
        <div className="selection">
            <Saison nomClass="saisonJoueur" saisons={saisons} saison={saison} setSaison={setSaison}/>
            <select defaultValue="" onChange={(e) => handleChange(e.target.value)}>
                <option value="">{langue.joueurs.jeux}</option>
                {jeux.map((jeu, index) => (
                    <option key={index} value={JSON.stringify(jeu)}>
                        {jeu.nom}
                    </option>
                ))}
            </select>
            <Form>
                <InputGroup>
                    <Form.Control onChange={(e) => setRecherche(e.target.value)} placeholder={langue.joueurs.recherche}/>
                </InputGroup>
            </Form>
        </div>
    );
};

export default Joueurs;