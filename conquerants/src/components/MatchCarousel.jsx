import React from 'react';
import { Card } from 'react-bootstrap';
import valo from "../images/Valorant.png";
import lol from "../images/League Of Legends.png";
import rl from "../images/Rocket League.png";
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/MatchCarousel.css';

Axios.defaults.baseURL = 'https://conquerants.azurewebsites.net';
Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

function MatchCarousel({matchs, langue}) {

 const dateFormat = {month: 'short', day: '2-digit', timeZone: "UTC" }
 const timeFormat = {hour: '2-digit', minute: '2-digit', hour12: false, timeZone: "UTC" };

 // Groupe les matchs par leur date (YYYY-MM-DD)
 const matchsGroupe = matchs.reduce((acc, match) => {
  const date = new Date(match.date_match).toISOString().split('T')[0];
  
  if (!acc[date]) {
    acc[date] = [];
  }

  acc[date].push(match);
  return acc;
}, {});

return (
  <div className="upcoming-matches" style={{ display: matchs.length > 0 ? 'flex' : 'none' }}>
    <div className="match-cards">
      {Object.entries(matchsGroupe).map(([date, matches]) => (
        <div key={date} className="match-group">
          <p className="date">{new Date(date).toLocaleDateString(langue.date_format, dateFormat)}</p>
          <div className="match-list">
            {matches.map((match) => (
              <MatchCard key={match.id}
                equipe1={match.equipe1.nom} 
                equipe2={match.equipe2.nom}
                jeu={match.equipe1.jeu}
                heure={new Date(match.date_match).toLocaleTimeString(langue.date_format, timeFormat)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
 </div>
);
}

const MatchCard = ({equipe1, equipe2, jeu, heure}) => {

 let imgSrc;

 switch (jeu) {
  case 'Valorant':
   imgSrc = valo;
   break;
  case 'League of Legends':
   imgSrc = lol;
   break;
  case 'Rocket League':
   imgSrc = rl;
   break;
  default:
   imgSrc = "";
 }

 return (
  <div className="card">
   <Card.Body>
    <Card.Text className="game"><img src={imgSrc} alt="gameIcon"/></Card.Text>
    <Card.Text className="heure">{heure}</Card.Text>
    <Card.Text>{equipe1}</Card.Text>
    <Card.Text>VS</Card.Text>
    <Card.Text>{equipe2}</Card.Text>
   </Card.Body>
  </div>
 );
}

export default MatchCarousel;