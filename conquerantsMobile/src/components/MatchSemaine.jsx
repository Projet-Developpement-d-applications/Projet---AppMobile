import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/MatchSemaineStyle';

const MatchSemaine = ({ matchs, jeux, langue }) => {

    const matchsParJeu = {};
    jeux.forEach(jeu => {
        matchsParJeu[jeu.nom] = [];
    });

    matchs.forEach(match => {
        matchsParJeu[match.equipe1.jeu].push(match);
    });

    return (
        <View style={styles.matchContainer}>
            <Text style={styles.title}>{langue.match_semaine.h1}</Text>
            <View style={styles.matchTable}>
                {jeux.map((jeu, jeuIndex) => (
                    <View key={jeuIndex} style={styles.tableRow}>
                        {matchsParJeu[jeu.nom].length > 0 ? (
                            matchsParJeu[jeu.nom].map((match, matchIndex) => (
                                <View key={matchIndex} style={styles.match}>
                                    <View style={[styles.team, { backgroundColor: match.score1 > match.score2 ? 'green' : 'red' }]}>
                                        <Text style={styles.teamName}>{match.equipe1.nom}</Text>
                                        <Text style={styles.score}>{match.score1}</Text>
                                    </View>
                                    <View style={styles.line}></View>
                                    <View style={[styles.team, { backgroundColor: match.score2 > match.score1 ? 'green' : 'red' }]}>
                                        <Text style={styles.teamName}>{match.equipe2.nom}</Text>
                                        <Text style={styles.score}>{match.score2}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noMatch}>{langue.match_semaine.aucun}</Text>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}

export default MatchSemaine;
