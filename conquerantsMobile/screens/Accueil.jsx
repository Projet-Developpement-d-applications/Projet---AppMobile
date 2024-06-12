import React, { useState } from 'react';
import Axios from 'axios';
import { useQuery } from 'react-query';
import { View, Text, StyleSheet } from 'react-native';

function Accueil({ langue }) {

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
        //return <Loading/>
    }
    
    if (isError1 || isError2 || isError3) {
        //return <Erreur/>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Accueil
            </Text>
        </View>
    );
}

export default Accueil;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
    },

    text: {
        color: "#f5f5f5",
    }
});