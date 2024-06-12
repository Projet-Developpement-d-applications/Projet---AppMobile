import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function MatchSemaine({ matchs, jeux, langue }) {
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
            <View style={styles.tableContainer}>
                {jeux.map((jeu, jeuIndex) => (
                    <View key={jeuIndex} style={styles.column}>
                        <Text style={styles.columnHeader}>{jeu.nom}</Text>
                        {matchsParJeu[jeu.nom].length > 0 ? (
                            matchsParJeu[jeu.nom].map((match, matchIndex) => (
                                <View key={matchIndex} style={styles.match}>
                                    <View style={[styles.team, styles.team1, match.score1 > match.score2 ? styles.teamWinner : styles.teamLoser]}>
                                        <Text style={[styles.teamName, { color: match.score1 > match.score2 ? '#d4af37' : '#AAA' }]}>{match.equipe1.nom}</Text>
                                        <Text style={[styles.score, { color: match.score1 > match.score2 ? '#d4af37' : '#AAA' }]}>{match.score1}</Text>
                                    </View>
                                    <View style={styles.line}></View>
                                    <View style={[styles.team, match.score2 > match.score1 ? styles.teamWinner : styles.teamLoser]}>
                                        <Text style={[styles.teamName, { color: match.score2 > match.score1 ? '#d4af37' : '#AAA' }]}>{match.equipe2.nom}</Text>
                                        <Text style={[styles.score, { color: match.score2 > match.score1 ? '#d4af37' : '#AAA' }]}>{match.score2}</Text>
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

const styles = StyleSheet.create({
    matchContainer: {
        width: "100%",
        backgroundColor: "#000",
        borderRadius: 15,
    },
    title: {
        textAlign: "center",
        color: "#f5f5f5",
        fontSize: 30,
        fontWeight: 'bold',
        padding: 16,
    },
    tableContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
    },
    columnHeader: {
        color: '#f5f5f5',
        padding: 16,
        fontSize: 20,
        height: 90,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    match: {
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 8,
        paddingLeft: 4,
        paddingRight: 4,
    },
    team: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 20,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        width: '100%',
        borderLeftWidth: 4,
    },
    team1: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#FFF',
    },
    teamWinner: {
        borderLeftColor: '#d4af37',
    },
    teamLoser: {
        borderLeftColor: '#AAA',
    },
    line: {
        width: 'auto',
        height: 1,
    },
    teamName: {
        marginLeft: 4,
        marginRight: 4,
        textAlign: 'left',
    },
    score: {
        marginRight: 4,
        textAlign: 'right',
        right: 0,
    },
    noMatch: {
        color: '#808080',
        marginTop: 16,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        textAlign: 'center',
    },
});

export default MatchSemaine;
