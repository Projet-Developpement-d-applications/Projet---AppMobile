import React from 'react';
import { View, Text, Image } from 'react-native';
import { Card } from 'react-native-elements'; // You may need to install this library
import valo from "../../images/Valorant.png";
import lol from "../../images/League Of Legends.png";
import rl from "../../images/Rocket League.png";
import Axios from 'axios';
import styles from '../styles/MatchCarouselStyle';

Axios.defaults.baseURL = 'https://conquerants.azurewebsites.net';
Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const MatchCarousel = ({ matchs, langue }) => {

    const dateFormat = { month: 'short', day: '2-digit' };
    const timeFormat = { hour: '2-digit', minute: '2-digit' };

    const matchsGroupe = matchs.reduce((acc, match) => {
        const date = new Date(match.date_match).toISOString().split('T')[0];

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push(match);
        return acc;
    }, {});

    return (
        <View style={{ display: matchs.length > 0 ? 'flex' : 'none' }}>
            <View style={styles.matchCards}>
                {Object.entries(matchsGroupe).map(([date, matches]) => (
                    <View key={date} style={styles.matchGroup}>
                        <Text style={styles.date}>{new Date(date).toLocaleDateString(langue.date_format, dateFormat)}</Text>
                        <View style={styles.matchList}>
                            {matches.map((match) => (
                                <MatchCard key={match.id}
                                    equipe1={match.equipe1.nom}
                                    equipe2={match.equipe2.nom}
                                    jeu={match.equipe1.jeu}
                                    heure={new Date(match.date_match).toLocaleTimeString(langue.date_format, timeFormat)}
                                />
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const MatchCard = ({ equipe1, equipe2, jeu, heure }) => {

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
            imgSrc = null;
    }

    return (
        <Card containerStyle={styles.card}>
            <Card.Title><Image source={imgSrc} style={styles.gameIcon} /></Card.Title>
            <Text style={styles.heure}>{heure}</Text>
            <Text>{equipe1}</Text>
            <Text>VS</Text>
            <Text>{equipe2}</Text>
        </Card>
    );
}

export default MatchCarousel;
