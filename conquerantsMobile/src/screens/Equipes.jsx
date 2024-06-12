import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '../components/Loading';
import Erreur from '../components/Erreur';
import ValoBanniere from '../../images/valo.jpeg';
import RocketBanniere from '../../images/rl.jpeg';
import LeagueBanniere from '../../images/lol.jpeg';
import JoueurImage from '../../images/joueur.jpg';
import Saison from '../components/Saison';
import styles from '../styles/EquipesStyle'; // Import your styles here
import { ScrollView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;

function Equipes({ langue, jeu, saison, setSaison }) {
    const [equipes, setEquipes] = useState([]);
    const [saisons, setSaisons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isErreur, setIsErreur] = useState(false);
    const [image, setImage] = useState();
    const [description, setDescription] = useState("");
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [mobileSlide, setMobileSlide] = useState(false);

    const fetchSaisons = async () => {
        try {
            const response = await Axios.get("https://conquerants.azurewebsites.net/noAuth/saisons");
            setSaisons(response.data);
            if (saison === "") {
                setSaison(response.data[response.data.length - 1]);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const { isFetching, isError } = useQuery({
        queryFn: () => fetchSaisons(),
        queryKey: ["equipes"],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const calculateSlidesToShow = () => {
            const width = windowWidth;
            if (width <= 450) {
                setSlidesToShow(1);
                setMobileSlide(true);
            } else if (width <= 768) {
                setSlidesToShow(1);
                setMobileSlide(false);
            } else if (width <= 1200) {
                setSlidesToShow(2);
                setMobileSlide(false);
            } else {
                setSlidesToShow(3);
                setMobileSlide(false);
            }
        };

        calculateSlidesToShow();
        Dimensions.addEventListener('change', calculateSlidesToShow);

        return () => {
            Dimensions.removeEventListener('change', calculateSlidesToShow);
        };
    }, []);

    useEffect(() => {
        const fetchEquipes = async () => {
            setIsLoading(true);

            try {
                const response = await Axios.post("https://conquerants.azurewebsites.net/noAuth/equipeLimoilouParJeu", { jeu: jeu, saison: saison.debut });
                setEquipes(response.data);
            } catch (error) {
                setIsErreur(true);
                console.error("Error fetching data", error);
            }

            setIsLoading(false);
        };

        const setGameInfo = () => {
            switch (jeu) {
                case "Valorant":
                    setImage(ValoBanniere);
                    setDescription(langue.valo.description);
                    break;

                case "League of Legends":
                    setImage(LeagueBanniere);
                    setDescription(langue.lol.description);
                    break;

                case "Rocket League":
                    setImage(RocketBanniere);
                    setDescription(langue.rl.description);
                    break;

                default:
                    break;
            }
        };

        fetchEquipes();
        setGameInfo();
    }, [saison, jeu, langue]);

    if (isFetching || isLoading) {
        return <Loading />;
    }

    if (isError || isErreur) {
        return <Erreur />;
    }

    return (
        <View style={styles.container}>
            <Image source={image} style={styles.imageContainer} />
            <Text style={styles.titreJeu}>{jeu.toUpperCase()}</Text>
            <Saison nomClass="saisonEquipe" saisons={saisons} saison={saison} setSaison={setSaison} />
            <View style={styles.content}>
                <View style={styles.infoJeu}>
                    {equipes.length > 0 && <Text style={styles.nombreEquipe}>{equipes.length > 1 ? langue.equipes.nos : langue.equipes.notre}</Text>}
                    <Text style={styles.nomJeu}>{jeu.toUpperCase()}</Text>
                    <Text style={styles.descriptionJeu}>{description}</Text>
                </View>
    
                <View>
                <ScrollView
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.scrollViewContent}
>
  {equipes.map((equipe, index) => (
    <View key={index} style={styles.equipesContainer}>
      <Text style={styles.divisionEquipe}>Division {equipe.division}</Text>
      <Text style={styles.nomEquipe}>{equipe.nom.toUpperCase()}</Text>
      <View style={styles.joueursContainer}>
        {equipe.joueurs.map((joueur, index) => (
          <View key={index} style={styles.joueurCarte}>
            <Image source={JoueurImage} style={styles.joueurBody} />
            <Text style={styles.joueurPseudo}>{joueur.pseudo}</Text>
          </View>
        ))}
      </View>
    </View>
  ))}
</ScrollView>
                </View>
            </View>
        </View>
    );
};

export default Equipes;
