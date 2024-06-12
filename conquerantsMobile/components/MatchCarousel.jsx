import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import valo from '../images/Valorant.png';
import lol from "../images/LeagueOfLegends.png";
import rl from "../images/RocketLeague.png";

axios.defaults.baseURL = 'https://conquerants.azurewebsites.net';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

function MatchCarousel({ matchs, langue }) {
    const dateFormat = { month: 'short', day: '2-digit', timeZone: "UTC" };
    const timeFormat = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: "UTC" };

    return (
        <View style={{height: 150}}>
        <ScrollView horizontal={true} style={{display: matchs.length > 0 ? 'flex' : 'none'}} showsHorizontalScrollIndicator={false}>
            {Object.entries(matchs).map(([index, match]) => (
                <View key={index} style={[styles.matchGroup, index == 0 && styles.firstMatchGroup]}>
                    <Text style={styles.date}>{new Date(match.date_match).toLocaleDateString(langue.date_format, dateFormat)}</Text>
                    <MatchCard
                        key={match.id}
                        equipe1={match.equipe1.nom}
                        equipe2={match.equipe2.nom}
                        jeu={match.equipe1.jeu}
                        heure={new Date(match.date_match).toLocaleTimeString(langue.date_format, timeFormat)}
                    />
                </View>
            ))}
        </ScrollView>
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
        <View style={styles.card}>
            <View style={styles.cardBody}>
                {imgSrc && <Image source={imgSrc} style={styles.gameIcon} />}
                <Text style={[styles.heure, styles.cardText]}>{heure}</Text>
                <Text style={styles.cardText}>{equipe1}</Text>
                <Text style={styles.cardText}>VS</Text>
                <Text style={styles.cardText}>{equipe2}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    matchGroup: {
        alignItems: 'center',
        backgroundColor: '#04000c',
        borderBottomColor: '#F5F5F5',
        borderBottomWidth: 2,
        height: 139,
    },
    firstMatchGroup: {
        borderLeftColor: "#F5F5F5",
        borderLeftWidth: 4,
    },
    date: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
        color: "#f5f5f5",
    },
    matchList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        padding: 10,
        borderRightColor: "#f5f5f5",
        borderRightWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        width: 190,
        alignItems: 'center',
    },
    cardText: {
        color: "#f5f5f5",
    },
    cardBody: {
        alignItems: 'center',
        left: 30,
        bottom: 0,
    },
    gameIcon: {
        width: 50,
        height: 50,
        left: -70,
        bottom: 20,
        position: "absolute"
    },
    heure: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MatchCarousel;
