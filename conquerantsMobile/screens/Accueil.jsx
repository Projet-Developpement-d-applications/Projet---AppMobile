import React, { useState } from 'react';
import Axios from 'axios';
import { useQuery } from 'react-query';
import { View, StyleSheet, Image } from 'react-native';
import Loading from '../components/Loading';
import MatchCarousel from '../components/MatchCarousel';
import MatchSemaine from '../components/MatchSemaine';
import { ScrollView } from 'react-native-gesture-handler';

function Accueil({ route }) {

    const { langue } = route.params;
    const [matchsSemaine, setMatchsSemaine] = useState([]);
    const [matchsAVenir, setMatchsAVenir] = useState([]);
    const [jeux, setJeux] = useState([]);

    const fetchMatchAVenir = async () => {
        await Axios.get("https://conquerants.azurewebsites.net/noAuth/matchAVenir").then((response) => {
         setMatchsAVenir(response.data);
        }).catch((error) => {
         console.error("Error fecthing data", error);
        });
      };

      const fetchJeux = async () => {
        await Axios.get("https://conquerants.azurewebsites.net/noAuth/jeux").then((response) => {
            setJeux(response.data);
        }).catch((error) => {
            console.error("Error fecthing data", error);
        });
    }

    const fetchMatchsSemaine = async () => {
        await Axios.get("https://conquerants.azurewebsites.net/noAuth/matchDeLaSemaine").then((response) => {
            setMatchsSemaine(response.data);
        }).catch((error) => {
         console.error("Error fecthing data", error);
        });
      };
    
    const {isFetching: isFetching1, isError: isError1} = useQuery({
        queryFn: () => fetchMatchsSemaine(),
        queryKey: ["matchsSemaine"],
        refetchOnWindowFocus: false,
    });

    const {isFetching: isFetching2, isError: isError2} = useQuery({
        queryFn: () => fetchJeux(),
        queryKey: ["jeux"],
        refetchOnWindowFocus: false,
    });
      
    const {isFetching: isFetching3, isError: isError3} = useQuery({
        queryFn: () => fetchMatchAVenir(),
        queryKey: ["matchsAVenir"],
        refetchOnWindowFocus: false,
    });

    if (isFetching1 || isFetching2 || isFetching3) {
        return <Loading/>
    }
    
    if (isError1 || isError2 || isError3) {
        //return <Erreur/>
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.app}>
            <MatchCarousel langue={langue} matchs={matchsAVenir} />
            <Image source={require('../images/banniere_blanc.png')} style={styles.backgroundImage}></Image>
            <View style={styles.content}>
                <MatchSemaine langue={langue} jeux={jeux} matchs={matchsSemaine} />
            </View>
        </View>
        </ScrollView>
    );
}

export default Accueil;

const styles = StyleSheet.create({
    app: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#101010",
    },
    content: {
        flex: 1,
        color: '#f5f5f5',
        width: '100%',
        marginBottom: 50,
    },
    text: {
        color: "#f5f5f5",
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        top: -10,
        resizeMode: 'contain',
        height: 200,
    },
});