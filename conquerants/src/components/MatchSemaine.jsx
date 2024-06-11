import React from "react";
import Axios from 'axios';
import { Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/MatchSemaine.css';

Axios.defaults.baseURL = 'https://conquerants.azurewebsites.net';
Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

function MatchSemaine({matchs, jeux, langue}) {

    const matchsParJeu = {};
  jeux.forEach(jeu => {
    matchsParJeu[jeu.nom] = [];
  });

  matchs.forEach(match => {
    matchsParJeu[match.equipe1.jeu].push(match);
  });

    return(
        <div className="matchContainer">
            <h1 className='title'>{langue.match_semaine.h1}</h1>
            <Table className="match-table" responsive>
                <thead>
                    <tr>
                        {jeux.map((jeu, index) => (
                            <th key={index}>{jeu.nom}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {jeux.map((jeu, jeuIndex) => (
                            <td key={jeuIndex}>
                                {matchsParJeu[jeu.nom].length > 0 ? (
                                    matchsParJeu[jeu.nom].map((match, matchIndex) => (
                                        <div className="match" key={matchIndex}>
                                            <div className="team" id={match.score1 > match.score2 ? "winner" : "loser"}>
                                                <span className="team-name">{match.equipe1.nom}</span>
                                                <span className="score">{match.score1}</span>
                                            </div>
                                            <div className="line"></div>
                                            <div className="team" id={match.score2 > match.score1 ? "winner" : "loser"}>
                                                <span className="team-name">{match.equipe2.nom}</span>
                                                <span className="score">{match.score2}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-match">{langue.match_semaine.aucun}</p>
                                )}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default MatchSemaine;