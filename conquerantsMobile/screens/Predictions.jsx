import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Axios from 'axios';
import Loading from '../components/Loading';
import Erreur from '../components/Erreur';
import Saison from '../components/Saison';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLangue } from '../Context/LangueContext';
import { useSaison } from '../Context/SaisonContext'; 

function Predictions() {
    const { langue } = useLangue();
    const {saison, setSaison, saisons } = useSaison();

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

    const navigation = useNavigation();

    const reloadPredictions = () => {
      const predictions = langue.navbar.predictions;
      navigation.navigate(predictions);
    };

    const fetchData = useCallback(async () => {
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
    }, [prediction]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

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

        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    }

    const handleClick = () => {
        setPending(true);

        var voteTemp = vote == 'true' ? true : false;

        Axios.post("https://conquerants.azurewebsites.net/ajouterPrediction", 
        { vote: voteTemp, id_match: matchFiltre.id},
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
        setTimeout(() => {
            setPrediction(prediction + 1);
            setMessage("");
            setJeuValue("");
            setMatchValue("");
            setPending(false);
            setMatchFiltre("");
            reloadPredictions();
        }, 2000);
    }

    return (
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.titrePrediction}>{langue.predictions.h1}</Text>
            <View style={styles.nouvellePrediction}>
                <Text style={styles.h2}>{langue.predictions.h2}</Text>
                <View style={styles.selectionPrediction}>
                    <View style={styles.selectionPickerContainer}>
                    <Picker
                        selectedValue={jeuValue}
                        style={styles.selectionPicker}
                        onValueChange={(itemValue) => handleChangeJeu(itemValue)}
                        dropdownIconColor='#fff'>
                        <Picker.Item label={langue.predictions.jeux} value="" />
                        {jeux.map((jeu, index) => (
                            <Picker.Item key={index} label={jeu.nom} value={JSON.stringify(jeu)} />
                        ))}
                    </Picker>
                    </View>
                    <View style={styles.selectionPickerContainer}>
                    <Picker
                        selectedValue={matchValue}
                        style={styles.selectionPicker}
                        onValueChange={(itemValue) => handleChangeMatch(itemValue)}
                        dropdownIconColor='#fff'>
                        <Picker.Item label={langue.predictions.matchs} value="" />
                        {matchs.filter((match) => jeuMatch(match)).map((match, index) => (
                            <Picker.Item
                                key={index}
                                label={`${match.equipe1.nom} vs ${match.equipe2.nom} - ${formatDate(match.date_match)}`}
                                value={JSON.stringify(match)}
                            />
                        ))}
                    </Picker>
                    </View>
                </View>
                {matchFiltre !== "" && (
                    <View style={styles.predictionInfo}>
                        <Text style={styles.dateMatch}>{formatDateText(matchFiltre.date_match)}</Text>
                        <View style={styles.prediction}>
                            <Text style={[styles.nomEquipePrediction, styles.nomEquipePrediction1]}>{matchFiltre.equipe1.nom}</Text>
                            <View style={styles.votePickerContainer}>
                            <Picker
                                selectedValue={vote}
                                style={styles.votePrediction}
                                onValueChange={(itemValue) => setVote(itemValue)}
                                dropdownIconColor='#fff'>
                                <Picker.Item style={styles.voteLabel} label=">" value={'true'} />
                                <Picker.Item style={styles.voteLabel} label="<" value={'false'} />
                            </Picker>
                            </View>
                            <Text style={[styles.nomEquipePrediction, styles.nomEquipePrediction2]}>{matchFiltre.equipe2.nom}</Text>
                        </View>
                        <Text style={styles.predictionDescription}>
                            {langue.predictions.description} {"\n"}
                            <Text style={styles.predictionExemple}>{langue.predictions.ex}</Text>
                        </Text>
                        <TouchableOpacity
                            disabled={pending}
                            style={styles.buttonPrediction}
                            onPress={() => handleClick()}>
                            <Text style={styles.buttonText}>{langue.predictions.envoyer}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {pending && <Loading customClassName="loadingAuth" />}
                <Text style={styles.predictionRetour}>{message}</Text>
            </View>
            <View style={styles.predictions}>
                <Text style={styles.h1}>{langue.predictions.vos}</Text>
                <Text style={styles.h2}>{langue.predictions.complete}</Text>
                <PredictionTable
                    langue={langue}
                    saisons={saisons}
                    prediction={predictionsComplete}
                    saisonFiltre={saison}
                    setSaisonFiltre={setSaison}
                />
                <Text style={styles.h2}>{langue.predictions.attente}</Text>
                <PredictionTable
                    langue={langue}
                    saisons={saisons}
                    prediction={predictionsAttente}
                    saisonFiltre={saison}
                    setSaisonFiltre={setSaison}
                />
            </View>
        </ScrollView>
    );
}

function PredictionTable({ langue, saisons, prediction, saisonFiltre, setSaisonFiltre }) {

    const saisonMatch = (prediction) => {
        return saisonFiltre.debut === prediction.match.equipe1.saison.debut;
    }

    const trierPredictions = () => {
        return prediction
            .filter((pred) => saisonMatch(pred))
            .map((p, index) => (
                <View key={index} style={styles.predictionContainer}>
                    <Text style={styles.tableBodyText}>
                        {p.match.equipe1.nom} {"\n"} VS {"\n"} {p.match.equipe2.nom}
                    </Text>
                    <Text style={styles.tableBodyText}>
                        {p.match.score1} - {p.match.score2}
                    </Text>
                    <Text style={styles.tableBodyText}>{p.vote ? p.match.equipe1.nom : p.match.equipe2.nom}</Text>
                    <Text style={[styles.tableBodyText, p.match.jouer ? (p.resultat ? styles.win : styles.lose) : {}]}>
                        {p.resultat ? "O" : "X"}
                    </Text>
                </View>
            ));
    }

    return (
        <View style={styles.predictionsContainer}>
            <Saison nomClass={"selectionSaison"} />
            <View style={styles.tableauPredictions}>
                <View style={styles.tableHead}>
                    <Text style={styles.tableHeadText}>{langue.match}</Text>
                    <Text style={styles.tableHeadText}>{langue.score}</Text>
                    <Text style={styles.tableHeadText}>{langue.vote}</Text>
                    <Text style={styles.tableHeadText}>{langue.resultat}</Text>
                </View>
                {trierPredictions().length > 0 ? trierPredictions() : <Text style={styles.noPredictionsText}>{langue.predictions.aucune}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 20,
        backgroundColor: '#111',
    },
    titrePrediction: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFF',
    },
    nouvellePrediction: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 15,
        width: '100%',
    },
    predictions: {
        marginTop: 60,
        padding: 10,
        backgroundColor: '#000',
        width: '100%',
        borderRadius: 15,
        marginBottom: 50,
    },
    h1: {
        marginTop: 10,
        fontSize: 20,
        marginBottom: 10,
        color: '#fff',
        textAlign: 'center',
    },
    h2: {
        marginTop: 20,
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    selectionPrediction: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    selectionPicker: {
        color: '#fff',
    },
    selectionPickerContainer: {
        borderWidth: 3,
        borderColor: '#111',
        borderRadius: 15,
        height: 60,
        width: '100%',
        padding: 1,
        marginBottom: 5,
    },
    predictionInfo: {
        backgroundColor: '#000',
        borderRadius: 15,
        borderColor: '#d3333e',
        borderWidth: 2,
        margin: 10,
        padding: 10,
    },
    prediction: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    votePrediction: {
        color: '#fff',
    },
    votePickerContainer: {
        borderWidth: 2,
        borderColor: '#FFF',
        borderRadius: 15,
        height: 80,
        width: '32%',
        padding: 1,
    },
    voteLabel: {
        fontSize: 28,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    nomEquipePrediction: {
        marginTop: 5,
        width: 120,
        height: 30,
        fontWeight: '500',
        color: '#fff',
    },
    nomEquipePrediction1: {
        textAlign: 'right',
        marginRight: 10,
    },
    nomEquipePrediction2: {
        textAlign: 'left',
        marginLeft: 10,
    },
    predictionDescription: {
        color: '#c0c0c0',
        fontSize: 12,
        marginTop: 10,
        textAlign: 'center',
    },
    predictionExemple: {
        display: 'block',
    },
    buttonPrediction: {
        backgroundColor: '#d3333e',
        borderColor: '#d3333e',
        borderWidth: 1,
        borderRadius: 5,
        color: '#f5f5f5',
        width: '50%',
        alignItems: 'center',
        padding: 10,
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#f5f5f5',
    },
    predictionRetour: {
        marginTop: 10,
        marginBottom: 10,
        color: '#f5f5f5',
        textAlign: 'center',
    },
    predictionsContainer: {
        borderColor: '#d3333e',
        borderRadius: 15,
        marginTop: 10,
    },
    tableauPredictions: {
        overflow: 'hidden',
        marginTop: 10,
    },
    tableHead: {
        flexDirection: 'row',
        backgroundColor: '#000',
        borderWidth: 2,
        borderColor: '#111',
        padding: 10,
    },
    tableHeadText: {
        color: '#f5f5f5',
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
    },
    predictionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#181818',
    },
    win: {
        color: '#00cc00',
        fontSize: 18,
    },
    lose: {
        color: 'red',
        fontSize: 18,
    },
    noPredictionsText: {
        color: '#f5f5f5',
        textAlign: 'center',
        padding: 20,
        borderBottomColor: '#111',
        borderBottomWidth: 2,
    },
    tableBodyText: {
        color: '#FFF',
        width: '25%',
        textAlign: 'center',
        fontSize: 13,
    },
    dateMatch: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 18,
    },
});

export default Predictions;
