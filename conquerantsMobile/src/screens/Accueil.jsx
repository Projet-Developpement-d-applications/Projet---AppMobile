import React, { useState } from 'react';
import { View, ActivityIndicator, Text, ScrollView, ImageBackground } from 'react-native';
import Axios from 'axios';
import { useQuery } from 'react-query';
import MatchCarousel from '../components/MatchCarousel';
import MatchSemaine from '../components/MatchSemaine';
import styles from '../styles/AccueilStyle';

Axios.defaults.baseURL = 'https://conquerants.azurewebsites.net';
Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

function Accueil({ route }) {
    const { langue } = route.params;
    const [matchsSemaine, setMatchsSemaine] = useState([]);
    const [matchsAVenir, setMatchsAVenir] = useState([]);
    const [jeux, setJeux] = useState([]);

    const fetchMatchAVenir = async () => {
        const response = await Axios.get("/noAuth/matchAVenir");
        setMatchsAVenir(response.data);
    };

    const fetchJeux = async () => {
        const response = await Axios.get("/noAuth/jeux");
        setJeux(response.data);
    };

    const fetchMatchsSemaine = async () => {
        const response = await Axios.get("/noAuth/matchDeLaSemaine");
        setMatchsSemaine(response.data);
    };

    const { isFetching: isFetching1, isError: isError1 } = useQuery({
        queryFn: fetchMatchsSemaine,
        queryKey: ["matchsSemaine"],
        refetchOnWindowFocus: false,
    });

    const { isFetching: isFetching2, isError: isError2 } = useQuery({
        queryFn: fetchJeux,
        queryKey: ["jeux"],
        refetchOnWindowFocus: false,
    });

    const { isFetching: isFetching3, isError: isError3 } = useQuery({
        queryFn: fetchMatchAVenir,
        queryKey: ["matchsAVenir"],
        refetchOnWindowFocus: false,
    });

    if (isFetching1 || isFetching2 || isFetching3) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (isError1 || isError2 || isError3) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>An error occurred while fetching data.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ImageBackground
                source={require('../../images/background.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <MatchCarousel langue={langue} matchs={matchsAVenir} />
                <View style={styles.content}>
                    <MatchSemaine langue={langue} jeux={jeux} matchs={matchsSemaine} />
                </View>
            </ImageBackground>
        </ScrollView>
    );
}

export default Accueil;
