import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'; // Ensure StyleSheet is imported
import { Picker } from '@react-native-picker/picker';
import { useSaison } from '../Context/SaisonContext';
import { useLangue } from '../Context/LangueContext';
import { useJeu } from '../Context/JeuContext';
import { useEquipe } from '../Context/EquipeContext';
import { useMatch } from '../Context/MatchContext';

function Matchs() {
    
    const { saison, setSaison, saisons } = useSaison();
    const { langue } = useLangue();
    const { jeux } = useJeu();
    const { equipes } = useEquipe();
    const { matchs } = useMatch();

    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(false);
    const [equipesFiltre, setEquipesFiltre] = useState([]);

    const [equipeFiltre, setEquipeFiltre] = useState({ nom: "" });
    const [jeuFiltre, setJeuFiltre] = useState({ nom: "" });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                setupEquipes(equipes, matchs);
            } catch (error) {
                console.error('Error:', error);
                setErreur(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaison = (saison) => {
        setEquipeFiltre({ nom: "" });
        setSaison(saison);
    }

    const setupEquipes = (equipes, matchs) => {
        const toutesEquipes = [...new Set([...matchs.map(match => match.equipe1.id), ...matchs.map(match => match.equipe2.id)])];

        const equipesAvecMatchs = []

        equipes.map(equipe => {
            if (toutesEquipes.includes(equipe.id)) {
                equipesAvecMatchs.push(equipe);
            }
            return true;
        });

        setEquipesFiltre(equipesAvecMatchs);
    }

    const jeuMatch = (equipe) => {
        return jeuFiltre.nom === '' || equipe.jeu === jeuFiltre.nom;
    }

    const saisonMatch = (equipe) => {
        return saison.debut === equipe.saison.debut;
    }

    const equipeMatch = (equipe) => {
        return equipeFiltre.nom === '' || equipe.id === equipeFiltre.id;
    }

    const trierEquipes = (setter, ascendant, value) => {
        setter(!ascendant);

        setMatchs([...matchs].sort((m1, m2) => {
            const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
            switch (value) {
                case "equipe1":
                    return collator.compare(m1.equipe1.nom, m2.equipe1.nom) * (ascendant ? 1 : -1);
                case "equipe2":
                    return collator.compare(m1.equipe2.nom, m2.equipe2.nom) * (ascendant ? 1 : -1);
                case "jeu":
                    return collator.compare(m1.equipe1.jeu, m2.equipe1.jeu) * (ascendant ? 1 : -1);
                case "date":
                    return collator.compare(m1.date_match, m2.date_match) * (ascendant ? 1 : -1);
                default:
                    return "";
            }
        }));
    }

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (erreur) {
        return <Text style={styles.erreur}>{langue.matchs.erreurChargement}</Text>;
    }

    function formatDate(date) {
        const d = new Date(date);

        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        const hours = String(d.getUTCHours()).padStart(2, '0');
        const minutes = String(d.getUTCMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const filtrerMatchs = () => {
        return matchs.filter((match) => {
            return saisonMatch(match.equipe1) && jeuMatch(match.equipe1) && equipeMatch(match.equipe1);
        });
    }

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.equipe1.nom}</Text>
            <Text style={styles.cell}>{item.equipe2.nom}</Text>
            <Text style={styles.cell}>{item.score1 + " - " + item.score2}</Text>
            <Text style={styles.cell}>{item.equipe1.jeu}</Text>
            <Text style={styles.cell}>{formatDate(item.date_match)}</Text>
        </View>
    );

    const matchAffichage = filtrerMatchs();

    return (
        <View style={styles.content}>
            <View style={styles.rechercheContainer}>
                <Text style={styles.titreJoueur}>{langue.matchs.h1}</Text>
                <Selection langue={langue} saisons={saisons} setSaison={handleSaison} saison={saison} jeux={jeux} jeuFiltre={jeuFiltre} equipeFiltre={equipeFiltre} setJeu={setJeuFiltre} equipes={equipesFiltre}
                    setEquipe={setEquipeFiltre} jeuMatch={jeuMatch} saisonMatch={saisonMatch} />
            </View>
            <FlatList
                data={matchAffichage}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text style={styles.empty}>{langue.matchs.aucun}</Text>}
            />
        </View>
    );
}

function Selection({ saisons, setSaison, saison, jeux, jeuFiltre, setJeu, equipes, setEquipe, equipeFiltre, jeuMatch, saisonMatch, langue }) {

    const handleChange = (value, setter) => {
        var jeuTemp = { nom: "" };

        if (value.nom !== "") {
            jeuTemp = JSON.parse(value);
        }

        setter(jeuTemp);
    }

    return (
        <View style={styles.selection}>
            <Picker
                selectedValue={JSON.stringify(saison)}
                style={styles.picker}
                onValueChange={(itemValue) => handleChange(itemValue, setSaison)}
            >
                {saisons.map((saison, index) => 
                    <Picker.Item key={index} label={`${saison.debut}-${saison.fin}`} value={JSON.stringify(saison)} />
                )}
            </Picker>
            <Picker
                selectedValue={JSON.stringify(jeuFiltre)}
                style={styles.picker}
                onValueChange={(itemValue) => handleChange(itemValue, setJeu)}
            >
                <Picker.Item label={langue.matchs.jeux} value={{ nom: "" }} />
                {jeux.map((jeu, index) => (
                    <Picker.Item key={index} label={jeu.nom} value={JSON.stringify(jeu)} />
                ))}
            </Picker>
            <Picker
                selectedValue={JSON.stringify(equipeFiltre)}
                style={styles.picker}
                onValueChange={(itemValue) => handleChange(itemValue, setEquipe)}
            >
                <Picker.Item label={langue.matchs.equipes} value={{ nom: "" }} />
                {equipes.filter((equipe) => {
                    return jeuMatch(equipe) && saisonMatch(equipe);
                }).map((equipe, index) => (
                    <Picker.Item key={index} label={`${equipe.nom} / ${equipe.jeu.substring(0, 3)}`} value={JSON.stringify(equipe)} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 10,
        backgroundColor: '#111',
    },
    rechercheContainer: {
        marginBottom: 20,
    },
    titreJoueur: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#FFF',
    },
    selection: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 10,
        color: '#FFF',
        backgroundColor: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        color: '#FFF',
    },
    empty: {
        marginTop: 50,
        textAlign: 'center',
        color: '#FFF',
    },
    erreur: {
        marginTop: 50,
        textAlign: 'center',
        color: 'red',
    },
});

export default Matchs;
