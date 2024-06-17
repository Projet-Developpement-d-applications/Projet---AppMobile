import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Axios from 'axios';
import Loading from '../components/Loading';
import Erreur from '../components/Erreur';
import ValoBanniere from '../images/valo.jpeg';
import RocketBanniere from '../images/rl.jpeg';
import LeagueBanniere from '../images/lol.jpeg';
import JoueurImage from '../images/joueur.jpg';
import Saison from '../components/Saison';
import { useSaison } from '../Context/SaisonContext';
import { useLangue } from '../Context/LangueContext';
import { getImage } from '../components/JoueurImage';

const { width: screenWidth } = Dimensions.get('window');

const Equipe = ({ route }) => {
    const { saison } = useSaison();
    const { langue } = useLangue();
    const { jeu } = route.params;

    const [equipes, setEquipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isErreur, setIsErreur] = useState(false);
    const [image, setImage] = useState(ValoBanniere);
    const [description, setDescription] = useState("");
    const [imageJoueurs, setImageJoueurs] = useState([]);

    useEffect(() => {
        const fetchEquipes = async () => {
            setIsLoading(true);

            await Axios.post("https://conquerants.azurewebsites.net/noAuth/equipeLimoilouParJeu", { jeu: jeu, saison: saison.debut }).then((response) => {
                setEquipes(response.data);
                setIsLoading(false);
            }).catch((error) => {
                setIsErreur(true);
                console.error("Error fetching data", error);
            });
        };

        const setGameInfo = () => {
            switch (jeu) {
                case langue.navbar.valo:
                    setImage(ValoBanniere);
                    setDescription(langue.valo.description);
                    break;
                case langue.navbar.lol:
                    setImage(LeagueBanniere);
                    setDescription(langue.lol.description);
                    break;
                case langue.navbar.rl:
                    setImage(RocketBanniere);
                    setDescription(langue.rl.description);
                    break;
                default:
                    break;
            }
        }

        fetchEquipes();
        setGameInfo();
    }, [saison, jeu, langue]);

    useEffect(() => {
        const fetchJoueursImages = async () => {
          try {
            const joueursImagesTemp = [];
            const promises = [];
      
            equipes.forEach(equipe => {
              equipe.joueurs.forEach(joueur => {
                const promise = getImage(saison.debut, jeu, joueur.pseudo)
                  .then(imgTemp => {
                    if (imgTemp) {
                        joueursImagesTemp.push({ pseudo: joueur.pseudo, image: imgTemp});
                    }
                  })
                  .catch(error => {
                    console.error(`Error fetching image for joueur ${joueur.pseudo}:`, error);
                  });
      
                promises.push(promise);
              });
            });
      
            await Promise.all(promises);
      
            setImageJoueurs(joueursImagesTemp);
          } catch (error) {
            console.error('Error fetching images for joueurs:', error);
          }
        };
      
        if (equipes) {
          fetchJoueursImages();
        }
      }, [equipes]);

    if (isLoading) {
        return <Loading />;
    }

    if (isErreur) {
        return <Erreur />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {isLoading ? <Loading/> : <View style={styles.container}>
            <View style={styles.saisonEquipe}>
                <Saison/>
            </View>
            <Image source={image} style={styles.imageContainer} />
            <Text style={styles.titreJeu}>{jeu.toUpperCase()}</Text>
            
            <View style={styles.content}>
                <View style={styles.infoJeu}>
                    {equipes.length > 0 && <Text style={styles.nombreEquipe}>{equipes.length > 1 ? langue.equipes.nos : langue.equipes.notre}</Text>}
                    <Text style={styles.nomJeu}>{jeu.toUpperCase()}</Text>
                    <Text style={styles.descriptionJeu}>{description}</Text>
                </View>

                {equipes.map((equipe, index) => (
                    <View key={index} style={styles.equipeContainer}>
                        <Text style={styles.divisionEquipe}>{"Division " + equipe.division}</Text>
                        <Text style={styles.nomEquipe}>{equipe.nom.toUpperCase()}</Text>
                        <ScrollView horizontal style={styles.joueursContainer} contentContainerStyle={styles.joueursContent} showsHorizontalScrollIndicator={false}>
                            {equipe.joueurs.map((joueur, idx) => (
                                <View key={idx} style={styles.joueurCarte}>
                                    {imageJoueurs.find(j => j.pseudo === joueur.pseudo ) ?
                                        <Image source={{ uri: imageJoueurs.find(j => j.pseudo === joueur.pseudo).image, scale: 1}} style={styles.joueurBody} /> :
                                        <Image source={JoueurImage} style={styles.joueurBody} />
                                    }
                                    <Text style={styles.joueurPseudo}>{joueur.pseudo}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                ))}
            </View>
            </View>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#000',
    },
    imageContainer: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    titreJeu: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 150,
        textAlign: 'center',
        position: 'absolute',
    },
    content: {
        width: '100%',
    },
    infoJeu: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    nomJeu: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
    },
    nombreEquipe: {
        color: '#d3333e',
        fontSize: 14,
    },
    descriptionJeu: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    equipeContainer: {
        marginBottom: 20,
    },
    nomEquipe: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    divisionEquipe: {
        color: '#d3333e',
        fontSize: 16,
        textAlign: 'center',
    },
    joueursContainer: {
        width: '100%',
    },
    joueursContent: {
        paddingVertical: 10,
        paddingLeft: 55,
        paddingRight: 55,
    },
    joueurCarte: {
        height: 300,
        width: screenWidth * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    joueurBody: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    joueurPseudo: {
        position: 'absolute',
        bottom: 50,
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    saisonEquipe: {
        backgroundColor: '#111',
        width: '100%',
        borderRadius: 0,
    }
});

export default Equipe;
