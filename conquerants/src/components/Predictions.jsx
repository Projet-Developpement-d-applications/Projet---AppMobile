import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Loading from './Loading';
import Erreur from './Erreur';
import Saison from './Saison';
import '../styles/Predictions.css';

function Predictions({ messageRetour, saisonFiltre, setSaisonFiltre, saisons, langue }) {

    const navigate = useNavigate();

    const [matchs, setMatchs] = useState([]);
    const [jeux, setJeux] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(false);
    const [vote, setVote] = useState(true);
    const [message, setMessage] = useState("");
    const [pending, setPending] = useState(false);
    const [predictionsComplete, setPredictionsComplete] = useState([]);
    const [predictionsAttente, setPredictionsAttente] = useState([]);
    const [prediction, setPrediction] = useState(0);

    const [jeuValue, setJeuValue] = useState("")
    const [matchValue, setMatchValue] = useState("");
    const [jeuFiltre, setJeuFiltre] = useState({nom: ""});
    const [matchFiltre, setMatchFiltre] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [jeuxResponse, matchsResponse, predictionsResponse] = await Promise.all([
                    Axios.get('https://conquerants.azurewebsites.net/noAuth/jeux'),
                    Axios.get('https://conquerants.azurewebsites.net/matchSansPrediction', {withCredentials: true}),
                    Axios.get('https://conquerants.azurewebsites.net/predictionParUtilisateur', {withCredentials: true})
                ]);
                setJeux(jeuxResponse.data);
                setMatchs(matchsResponse.data);
                setupPredictions(predictionsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setErreur(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [prediction]);

    const setupPredictions = (predictions) => {
        setPredictionsComplete(predictions.filter(p => p.match.jouer));
        setPredictionsAttente(predictions.filter(p => !p.match.jouer));
    }

    if (loading) {
        return <Loading/>
    }
    
    if (erreur) {
        return <Erreur/>
    }

    if (messageRetour) {
        setMessage(messageRetour);
    }

    const jeuMatch = (match) => {
        return jeuFiltre.nom === '' || match.equipe1.jeu === jeuFiltre.nom;
    }

    const handleChangeJeu = (value) =>  {
        var jeuTemp = {nom: ""};

        if (value !== "") {
            jeuTemp = JSON.parse(value);
        }

        setJeuValue(value);
        setJeuFiltre(jeuTemp);
    }

    const handleChangeMatch = (value) =>  {
        var matchTemp = "";

        if (value !== "") {
            matchTemp = JSON.parse(value);
        }

        setMatchValue(value);
        setVote(true);
        setMatchFiltre(matchTemp);
    }

    function formatDate(date) {
        const d = new Date(date);
      
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
    }

    function formatDateText(date) {
        const d = new Date(date);

        const year = d.getUTCFullYear();
        const month = d.toLocaleString(langue.date_format, { month: 'long', timeZone: 'UTC' });
        const day = d.getUTCDate();
        const hours = d.getUTCHours().toString().padStart(2, '0');
        const minutes = d.getUTCMinutes().toString().padStart(2, '0');

        return day + " " + month + " " + year + ", " + hours + ":" + minutes;
    }

    const handleClick = () => {
        setPending(true);

        Axios.post("https://conquerants.azurewebsites.net/ajouterPrediction", 
        { vote: vote, id_match: matchFiltre.id},
        { withCredentials: true }
        ).then((response) => {
        if (response.data) {
            setMessage(response.data);
            reset();
        }
        }).catch(error => {
            setMessage(langue.predictions.msg_erreur);
            reset();
            
            const errorMessage = error.response ? error.response.data : 'An unexpected error occurred.';
            console.log(errorMessage);
        });
    }

    const reset = () => {
        navigate("/predictions")

        setTimeout(() => {
            setPrediction(prediction + 1);
            setMessage("");
            setJeuValue("");
            setMatchValue("");
            setPending(false);
            setMatchFiltre("");
        }, 1000);
    }

    return (
        <div className="content">
            <h1 className="titreJoueur">{langue.predictions.h1}</h1>
            <div className="nouvellePrediction">
                <h1>{langue.predictions.h2}</h1>
                <div className="selectionPrediction">
                    <select value={jeuValue} onChange={(e) => handleChangeJeu(e.target.value)}>
                        <option value="">{langue.predictions.jeux}</option>
                        {jeux.map((jeu, index) => (
                            <option key={index} value={JSON.stringify(jeu)}>
                                {jeu.nom}
                            </option>
                        ))}
                    </select>
                    <select value={matchValue} onChange={(e) => handleChangeMatch(e.target.value)}>
                        <option value="">{langue.predictions.matchs}</option>
                        {matchs.filter((match) => {
                            return jeuMatch(match);
                        }).map((match, index) => (
                        <option key={index} value={JSON.stringify(match)}>
                            {match.equipe1.nom + " vs " + match.equipe2.nom + " - " + formatDate(match.date_match)}
                        </option>
                        ))}
                    </select>
                </div>
                {matchFiltre !== "" && <div className="predictionInfo">
                    <p>{formatDateText(matchFiltre.date_match)}</p>
                        <div className="prediction">
                            <p className="nomEquipePrediction">{matchFiltre.equipe1.nom}</p>
                            <select value={vote} className="votePrediction" onChange={(e) => setVote(e.target.value)}>
                                <option value={true}>&gt;</option>
                                <option value={false}>&lt;</option>
                            </select>
                            <p className="nomEquipePrediction">{matchFiltre.equipe2.nom}</p>
                        </div>
                    <p className="predictionDescription">
                        {langue.predictions.description}
                        <span className="predictionExemple">{langue.predictions.ex}</span>
                    </p>
                    <Button disabled={pending} className="buttonPrediction" onClick={() => handleClick()}>{langue.predictions.envoyer}</Button>
                </div>}
                <p className="predictionRetour">{message}</p>
            </div>
            <div className="predictions">
                <h1>{langue.predictions.vos}</h1>
                <h2>{langue.predictions.complete}</h2>
                <PredictionTable langue={langue} saisons={saisons} prediction={predictionsComplete} saisonFiltre={saisonFiltre} setSaisonFiltre={setSaisonFiltre} />
                <h2>{langue.predictions.attente}</h2>
                <PredictionTable langue={langue} saisons={saisons} prediction={predictionsAttente} saisonFiltre={saisonFiltre} setSaisonFiltre={setSaisonFiltre} />
            </div>
        </div>
    );
}

function PredictionTable({ langue, saisons, prediction, saisonFiltre, setSaisonFiltre }) {

    const saisonMatch = (prediction) => {
        return saisonFiltre.debut === prediction.match.equipe1.saison.debut;
    }

    const trierPredictions = () => {
        return prediction.filter((pred) => {
            return saisonMatch(pred);
        }).map((p, index) => {
            return <tr key={index}>
                <td>
                    {p.match.equipe1.nom}<br/>VS<br/>{p.match.equipe2.nom}
                </td>
                <td>
                    {p.match.score1 + " - " + p.match.score2}
                </td>
                <td>
                    {p.vote ? p.match.equipe1.nom : p.match.equipe2.nom}
                </td>
                <td className={p.match.jouer ? p.resultat ? "win" : "lose" : ""}>
                    {p.resultat ? "O" : "X"}
                </td>
            </tr>
        });
    }

    var pred = trierPredictions();

    return (
        <div className="predictionsContainer">
            <Saison saisons={saisons} saison={saisonFiltre} setSaison={setSaisonFiltre} nomClass={"selectionSaison"}/>
            <Table className="tableauPredictions">
                <thead>
                    <tr>
                        <th>
                            {langue.match}
                        </th>
                        <th>
                            {langue.score}
                        </th>
                        <th>
                            {langue.vote}
                        </th>
                        <th>
                            {langue.resultat}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pred.length > 0 ? pred :
                    <tr>
                        <td colSpan={4}>
                            {langue.predictions.aucune}
                        </td>
                    </tr>}
                </tbody>
            </Table>
        </div>
    );
}

export default Predictions;