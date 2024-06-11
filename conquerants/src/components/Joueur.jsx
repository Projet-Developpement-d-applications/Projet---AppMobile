import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import JoueurImage from '../images/joueur.jpg';
import { useQuery } from "react-query";
import Loading from "./Loading";
import Erreur from "./Erreur";
import Axios from "axios";
import { Table } from "react-bootstrap";
import '../styles/Joueur.css';
import { getImage } from "./JoueurImage";

function Joueur({ langue, langueStat }) {

    const { saison, jeu, pseudo } = useParams();
    const [erreur, setErreur] = useState(false);
    const [joueur, setJoueur] = useState("");
    const [stats, setStats] = useState([]);
    const [statsMoyenne, setStatsMoyenne] = useState([]);
    const [statsFr, setStatsFr]  = useState([]);
    const [moyenne, setMoyenne] = useState([]);
    const [afficher, setAfficher] = useState(false);
    const [image, setImage] = useState();
    const [imageIsFetch, setImageIsFetch] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            const image = await getImage(saison, jeu.toLowerCase(), pseudo.toLowerCase());
            if (image) {
                setImage(image);
            }
        }
        
        fetchImage();
    }, [saison, jeu, pseudo]);
        

    useEffect(() => {
        switch(jeu) {
            case "Valorant":
                setStats(langue.valo.stats);
                setStatsMoyenne(langue.valo.statsMoyenne);
                setStatsFr(langueStat.valo.stats);
                break;

            case "League of Legends":
                setStats(langue.lol.stats);
                setStatsMoyenne(langue.lol.statsMoyenne);
                setStatsFr(langueStat.lol.stats);
                break;

            case "Rocket League":
                setStats(langue.rl.stats);
                setStatsMoyenne(langue.rl.statsMoyenne);
                setStatsFr(langueStat.rl.stats);
                break;
            default :
                break;
        }
    }, [jeu, langue]);

    useEffect(() => {
        const plusFrequent = (array) => {
            const occurrences = {};
    
            array.forEach(value => {
                occurrences[value] = (occurrences[value] || 0) + 1;
            });

            let maxOccurrence = 0;
            let mostFrequentValue;
            for (const [value, occurrence] of Object.entries(occurrences)) {
                if (occurrence > maxOccurrence) {
                    maxOccurrence = occurrence;
                    mostFrequentValue = value;
                }
            }

            return mostFrequentValue;
        }

        const getMoyenne = (data) => {
            const length = stats.length;
            const total = Array.from({length}, () => 0);
            const nbrStat = Array.from({length}, () => 0);
            const moyenne = Array.from({length}, () => 0);

            data.forEach((stat) => {
                var statJson = JSON.parse(stat.donnee);

                statsFr.map((stat, index) => {
                    if (statJson[stat] && statJson[stat].victoire !== 0) {
                    
                        var numValue = parseFloat(statJson[stat]);
                        nbrStat[index]++;

                        if (!isNaN(numValue)) {
                            total[index] += numValue;
                        } else {
                            if (stat === langueStat.victoire) {
                                total[index] += statJson[stat] === "Victoire" ? 100 : 0;
                            } else {
                                if (Array.isArray(total[index])) {
                                    total[index].push(statJson[stat]);
                                } else {
                                    total[index] = [statJson[stat]];
                                }
                            }
                        }
                    }
                });
            });

            for(var i = 0; i < length; i++) {
                if (!Array.isArray(total[i])) {
                    moyenne[i] = Math.round((total[i] / nbrStat[i]) * 100) / 100;
                } else {
                    moyenne[i] = plusFrequent(total[i]);
                }
                
            }

            if (moyenne[0]) {
                setMoyenne(moyenne);
                setAfficher(true); 
            }
        }

        if (joueur.statistiques) {
            getMoyenne(joueur.statistiques);
        }
    }, [joueur.statistiques]);

    const fetchJoueur = async () => {
        await Axios.post("https://conquerants.azurewebsites.net/noAuth/joueurParPseudo", {
            pseudo: pseudo,
            jeu: jeu,
            saison: saison
        }).then((response) => {
            if (response.data === "") {
                setErreur(true);
            } else {
                setJoueur(response.data);
            }
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    };
    
    const {isFetching, isError} = useQuery({
        queryFn: () => fetchJoueur(),
        queryKey: ["joueur"],
        refetchOnWindowFocus: false,
    });

    if (isFetching || !joueur) {
        return <Loading/>
    }
    
    if (isError || erreur) {
        return <Erreur/>
    }

    const filterStats = (donnee) => {
        const filteredValues = [];
    
        statsFr.forEach((stat) => {
          if (donnee[stat] && donnee[stat].victoire !== 0) {
            var dataToPush = donnee[stat];
            if (stats != statsFr && (donnee[stat] === "Victoire" || donnee[stat] === "Défaite")) {
                dataToPush = donnee[stat] === "Victoire" ? "Win" : "Lose";
            }
            
            filteredValues.push(dataToPush);
          }
        });

        return filteredValues;
    };

    return(
        <div className="joueurContent">
            <div className="joueurInfo">
                <div className="profilJoueur" >
                    <img className="imageJoueur" src={image ? image : JoueurImage} alt="profilJoueur"></img>
                </div>
                <div className="joueurText">
                    <h1 className={"pseudoJoueur"}>{joueur.pseudo}</h1>
                    <p className="joueurP">{joueur.prenom + " " + joueur.nom}</p>
                    <p className="joueurP">{joueur.equipe.nom}</p>
                    {joueur.position && <p className="joueurP">{joueur.position}</p>}
                </div>
            </div>
            <Table responsive striped className="joueurStats">
                <thead>
                    <tr>
                        {statsMoyenne.map((stat, index) => {
                            return <th key={index}>{stat}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                        {moyenne.length > 0 ? 
                        <tr>
                            {moyenne.map((stat, index) => {
                                return <td key={index}>{stat}</td>
                            })}
                        </tr> :
                        <tr><td colSpan={stats.length}>{langue.joueurs.aucune}</td></tr>
                        }
                </tbody>
            </Table>
            <div className="fillJoueur">
                <h1 className="fillTitre">Stats par partie</h1>
            <Table responsive striped id="fillTable" className="tableauJoueurs" style={{display: afficher ? "" : "none"}}>
                <thead>
                    <tr>
                        {stats.map((stat, index) => {
                            return <th key={index}>{stat}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {joueur.statistiques.map((stat, index) => {
                        var currentStats = filterStats(JSON.parse(stat.donnee));
                        
                        return currentStats.length > 0 &&
                            <tr key={index}>
                                {currentStats.map((value, index) => {
                                    return <td key={index}>{value}</td>
                                })}
                            </tr>
                    })}
                </tbody>
            </Table>
            </div>
        </div>
    );
}

export default Joueur;