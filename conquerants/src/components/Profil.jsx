import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "../styles/Admin.css";
import Loading from './Loading';
import { Button } from 'react-bootstrap';
import { valideMdp, valideNomPrenom } from './Validation';
import { encrypt } from './Encryption';
import '../styles/Profil.css';

function Profil({ handleDeconnexion, langue }) {
    
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [mdpTemp, setMdpTemp] = useState("");
    const [nouveauMdp, setNouveauMdp] = useState("");
    const [prenomErreur, setPrenomErreur] = useState("");
    const [nomErreur, setNomErreur] = useState("");
    const [mdpTempErreur, setMdpTempErreur] = useState("");
    const [nouveauMdpErreur, setNouveauMdpErreur] = useState("");
    const [modifStatus, setModifStatus] = useState("");
    const [modifErreur, setModifErreur] = useState(false);

    const [modification, setModification] = useState(false);
    const [utilisateur, setUtilisateur] = useState({pseudo: "", role: ""});
    const [pendingDeconnexion, setPendingDeconnexion] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUtilisateur = async () => {
            setLoading(true);

            await Axios.get("https://conquerants.azurewebsites.net/utilisateurInfo", 
            { withCredentials: true }
            ).then((response) => {
                if (response.data) {
                    setUtilisateur(response.data);
                    setPrenom(response.data.prenom);
                    setNom(response.data.nom);
                }
                setLoading(false);
            }).catch(error => {
                const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred.';
                setLoading(false);
            });
        };

        fetchUtilisateur();
    }, []);

    const logout = () => {
        setPendingDeconnexion(true);
        handleDeconnexion();
    };

    const sauvegarderModification = () => {
        if (valideMdp(mdpTemp, setMdpTempErreur, langue) & valideMdp(nouveauMdp, setNouveauMdpErreur, langue) & valideNomPrenom(prenom, setPrenomErreur, langue) & valideNomPrenom(nom, setNomErreur, langue)) {
            Axios.put("https://conquerants.azurewebsites.net/modifierUtilisateur", 
            { ancien_mdp: encrypt(mdpTemp), nouveau_mdp: encrypt(nouveauMdp)},
            { withCredentials: true }
            ).then((response) => {
                if (response.data) {
                    setModifStatus(response.data);
                    setModifErreur(false);
                    setTimeout(() => {
                        setModifStatus("");
                    }, 2000);
                    stopModification();
                }
            }).catch(error => {
                const errorMessage = error.response ? error.response.data : 'An unexpected error occurred.';
                setModifStatus(errorMessage);
                setModifErreur(true);
                console.log(errorMessage);
                stopModification();
            });
        }
        
    };


    const handleChangeNoSpace = (value, setter, setterErreur) => {
        if (/\s/g.test(value)) {
            return;
        }
        valideNomPrenom(value, setterErreur, langue);
        setter(value);
    };

    if (loading) {
        return <Loading />;
    }

    const stopModification = () => {
        setPrenom(utilisateur.prenom);
        setNom(utilisateur.nom);
        setModification(false);
        setMdpTemp("");
        setNouveauMdp("");
        setMdpTempErreur("");
        setNouveauMdpErreur("");
        setNomErreur("");
        setPrenomErreur("");
    }

    const handleMdp = (value, setter, setterErreur) => {
        valideMdp(value, setterErreur, langue);
        setter(value);
    }

    return (
        <div className='content'>
            <h1 className="titreJoueur">{langue.profil.h1}</h1>

            <div className='profilContainer'>
                <small className={modifErreur ? "erreur" : "succes"}>{modifStatus}</small>
                <label>{langue.prenom}</label>
                <small className="erreur">{prenomErreur}</small>
                <input className="inputProfil"
                    type='text'
                    value={prenom}
                    onChange={(e) => handleChangeNoSpace(e.target.value, setPrenom, setPrenomErreur)}
                    disabled={true}
                />

                <label>{langue.nom}</label>
                <small className="erreur">{nomErreur}</small>
                <input className="inputProfil"
                    type='text'
                    value={nom}
                    onChange={(e) => handleChangeNoSpace(e.target.value, setNom, setNomErreur)}
                    disabled={true}
                />

                <label>{langue.pseudo}</label>
                <input className="inputProfil"
                    type='text'
                    value={utilisateur.pseudo}
                    disabled={true}
                />

                {!modification && (
                    <Button className="customButton buttonProfil lastButton" onClick={() => setModification(true)}>{langue.profil.modif}</Button>
                )}

                {modification && (
                    <div className="modifProfil">
                        <label>{langue.profil.actuel}</label>
                        <small className="erreur">{mdpTempErreur}</small>
                        <input className="inputProfil"
                            type="password"
                            value={mdpTemp}
                            onChange={(e) => handleMdp(e.target.value, setMdpTemp, setMdpTempErreur)}
                            disabled={!modification}
                        />
                        <label>{langue.profil.nouveau}</label>
                        <small className="erreur">{nouveauMdpErreur}</small>
                        <input className="inputProfil"
                            type="password"
                            onChange={(e) => handleMdp(e.target.value, setNouveauMdp, setNouveauMdpErreur)}
                            value={nouveauMdp}
                            disabled={!modification}
                        />

                        <Button className="customButton buttonProfil lastButton" onClick={() => stopModification()}>{langue.profil.annuler}</Button>
                        <Button className="customButton buttonProfil" onClick={() => sauvegarderModification()}>{langue.profil.save}</Button>
                    </div>
                )}

                <Button className="customButton buttonProfil" onClick={logout}>{langue.profil.deconnexion}</Button>
                {pendingDeconnexion && <Loading customClassName="loadingAuth"/>}
            </div>
        </div>
    );
}

export default Profil;
