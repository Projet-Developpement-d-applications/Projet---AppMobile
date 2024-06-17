import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Axios from 'axios';
import Loading from '../components/Loading';
import Erreur from '../components/Erreur';
import { useLangue } from '../Context/LangueContext';
import { useSaison } from '../Context/SaisonContext';
import { useEquipe } from '../Context/EquipeContext';
import { useJeu } from '../Context/JeuContext';
import JoueurImage from '../images/joueur.jpg';
import { ScrollView } from 'react-native-gesture-handler';
import { getImage } from '../components/JoueurImage';

function Joueurs() {
    const { langue } = useLangue();
    const { saison, setSaison, saisons } = useSaison();
    const { equipes } = useEquipe();
    const { jeux } = useJeu();

    const [joueurs, setJoueurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(false);
    const [image, setImage] = useState();

    const [equipeFiltre, setEquipeFiltre] = useState({ nom: "" });
    const [jeuFiltre, setJeuFiltre] = useState({ nom: "" });
    const [joueurFiltre, setJoueurFiltre] = useState({ nom : "" });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [joueursResponse] = await Promise.all([
                    Axios.get('https://conquerants.azurewebsites.net/noAuth/getAllJoueurs')
                ]);
                setJoueurs(joueursResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setErreur(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const getImageJoueur = () => {
            try {
                const promise = getImage(joueurFiltre.saison.debut, joueurFiltre.jeu, joueurFiltre.pseudo)
                .then(imgTemp => {
                    if (imgTemp) {
                        setImage(imgTemp);
                    } else {
                        setImage("");
                    }
                }).catch(error => {
                    console.error(`Error fetching image for joueur ${joueurFiltre.pseudo}:`, error);
                });
            } catch (error) {
                console.error(`Error fetching image for joueur ${joueurFiltre.pseudo}:`, error);
            };
        }

        if (joueurFiltre.nom !== "") {
            getImageJoueur();
        }
    }, [joueurFiltre])

    if (loading) {
        return <Loading />;
    }

    if (erreur) {
        return <Erreur />;
    }

    const jeuMatch = (joueur) => {
        return jeuFiltre.nom === '' || joueur.jeu === jeuFiltre.nom;
    };

    const saisonMatch = (joueur) => {
        return saison.id === joueur.saison.id;
    };

    const equipeMatch = (joueur) => {
        return equipeFiltre.nom === '' || equipeFiltre.id === joueur.equipe.id;
    }

    const filtrerJoueurs = () => {
        return joueurs.filter((joueur) => {
            return saisonMatch(joueur) && jeuMatch(joueur) && equipeMatch(joueur);
        });
    };

    const handleSaison = (saison) => {
        setEquipeFiltre({ nom: "" });
        setSaison(saison);
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.rechercheContainer}>
                <Text style={styles.titreJoueur}>{langue.joueurs.h1}</Text>
                <Selection langue={langue} saisons={saisons} setSaison={handleSaison} saison={saison} jeux={jeux} jeuFiltre={jeuFiltre} equipeFiltre={equipeFiltre} setJeu={setJeuFiltre} 
                equipes={equipes} setEquipe={setEquipeFiltre} joueurs={filtrerJoueurs} setJoueur={setJoueurFiltre} joueur={joueurFiltre} saisonMatch={saisonMatch} equipeMatch={equipeMatch} jeuMatch={jeuMatch} />
            </View>
            {joueurFiltre.nom !== "" &&
            <View>
                <View style={styles.joueurInfo}>
                    {image ? 
                    <Image style={styles.joueurImage} source={{uri: image}} /> :
                    <Image style={styles.joueurImage} source={JoueurImage} />}
                    <View style={styles.joueurTexte}>
                        <Text style={styles.joueurPseudo}>{joueurFiltre.pseudo}</Text>
                        <Text style={styles.joueurAutreTexte}>{joueurFiltre.prenom + " " + joueurFiltre.nom}</Text>
                        <Text style={styles.joueurAutreTexte}>{joueurFiltre.equipe.nom}</Text>
                        <Text style={styles.joueurAutreTexte}>{joueurFiltre.position}</Text>
                    </View>
                </View>
            </View>}
        </ScrollView>
    );
}

function Selection({ saisons, setSaison, saison, jeux, jeuFiltre, setJeu, equipes, setEquipe, equipeFiltre, langue, joueurs, joueur, setJoueur, jeuMatch, saisonMatch, equipeMatch }) {

    const handleChange = (value, setter) => {
        var jeuTemp = { nom: "" };

        if (value.nom !== "") {
            jeuTemp = JSON.parse(value);
        }

        setJoueur({ nom: "" });
        setter(jeuTemp);
    }

    const jeuMatchEquipe = (equipe) => {
        return jeuFiltre.nom === '' || equipe.jeu === jeuFiltre.nom;
    }

    const saisonMatchEquipe = (equipe) => {
        return saison.debut === equipe.saison.debut;
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
                    return jeuMatchEquipe(equipe) && saisonMatchEquipe(equipe);
                }).map((equipe, index) => (
                    <Picker.Item key={index} label={`${equipe.nom} / ${equipe.jeu.substring(0, 3)}`} value={JSON.stringify(equipe)} />
                ))}
            </Picker>
            <Picker
                selectedValue={JSON.stringify(joueur)}
                style={styles.picker}
                onValueChange={(itemValue) => handleChange(itemValue, setJoueur)}
            >
                <Picker.Item label={langue.joueurs.aucun} value={{ nom: "" }} />
                {joueurs().filter((j) => {
                    return jeuMatch(j) && saisonMatch(j) && equipeMatch(j);
                }).map((j, index) => (
                    <Picker.Item key={index} label={`${j.prenom} "${j.pseudo}" ${j.nom}`} value={JSON.stringify(j)} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#111',
    },
    titreJoueur: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#f5f5f5',
        marginBottom: 10,
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
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    joueurImage: {
        width: '40%',
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    joueurInfo: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#000',
        borderRadius: 15,
    },
    joueurTexte: {
        padding: 20,
        justifyContent: 'center',
    },
    joueurPseudo: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    joueurAutreTexte: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 5,
    },
    joueurNom: {
        marginBottom: 0,
    },
});

export default Joueurs;
