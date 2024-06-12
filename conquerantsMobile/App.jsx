import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Axios from 'axios';
import { Cookies } from '@react-native-cookies/cookies';

import Navbar from './src/components/Navbar';
import Accueil from './src/screens/Accueil';
import Equipes from './src/screens/Equipes';
{/*import Joueurs from './screens/Joueurs';
import Matchs from './screens/Matchs';
import Profil from './screens/Profil';
import Connexion from './screens/Connexion';
import Inscription from './screens/Inscription';
import Predictions from './screens/Predictions';
import ModifEquipes from './screens/ModifEquipes';
import ModifJoueurs from './screens/ModifJoueurs';
import ModifMatchs from './screens/ModifMatchs';
import AjoutEquipes from './screens/AjoutEquipes';
import AjoutJoueurs from './screens/AjoutJoueurs';
import AjoutMatchs from './screens/AjoutMatchs';
import Joueur from './screens/Joueur';
import Erreur from './screens/Erreur';
import AjoutPartie from './screens/AjoutPartie';
import AjoutModifEquipe from './screens/AjoutModifEquipe';
import AjoutModifJoueur from './screens/AjoutModifJoueur';
import AjoutModifMatch from './screens/AjoutModifMatch';*/}
import Loading from './src/components/Loading';
import lang from './json/lang.json';

const Stack = createStackNavigator();

function App() {
  const [connecter, setConnecter] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [saison, setSaison] = useState("");
  const [saisons, setSaisons] = useState([]);
  const [langue, setLangue] = useState(lang.fr);
  const [pseudoUser, setPseudoUser] = useState("");
  const [pendingConnexion, setPendingConnexion] = useState(true);

  const creerCookieLangue = async (langue) => {
    const cookie = `langue=${langue}`;
    await Cookies.set('langue', cookie);
  };
  

  const handleLangue = async (langue) => {
    if (langue === "fr") {
      setLangue(lang.fr);
    } else {
      setLangue(lang.en);
    }

    await creerCookieLangue(langue);
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [saisonsResponse] = await Promise.all([
                Axios.get('https://conquerants.azurewebsites.net/noAuth/saisons')
            ]);
            setSaisons(saisonsResponse.data);
            setSaison(saisonsResponse.data[saisonsResponse.data.length - 1]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const valideInfoConnexion = async () => {
      await Axios.get("https://conquerants.azurewebsites.net/connexionStatus", 
        { withCredentials: true }
        ).then((response) => {
          if (response.data === true) {
            setConnecter(true);
            refreshConnexion().then(setPendingConnexion(false));
          } else {
            setConnecter(false);
            handleDeconnexion().then(setPendingConnexion(false));
          }
      }).catch(error => {
        const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred.';
        setConnecter(false);
        setPendingConnexion(false);
        return false;
      });
    };

    const getCookieLangue = async () => {
      const cookie = await Cookies.get('langue');
      if (cookie) {
        const langueTemp = cookie.langue;
        handleLangue(langueTemp);
      }
    }; 

    if (pendingConnexion) {
      valideInfoConnexion();
      getCookieLangue();
    }
  });

  const handleConnexion = async (pseudo, mdp, setter) => {
    await Axios.post("https://conquerants.azurewebsites.net/connexion", 
      { pseudo: pseudo, mot_passe: encrypt(mdp)},
      { withCredentials: true }
      ).then((response) => {
      if (response.data) {
        const { role, pseudo } = response.data;

        setConnecter(true);
        setAdmin(role === "ADMIN");
        setPseudoUser(pseudo);
      }
      setter("");
    }).catch(error => {
      const errorMsg = error.response ? error.response.data.message : 'An unexpected error occurred.';
      setter(errorMsg);
    });
  };

  const handleInscription = async (prenom, nom, pseudo, mdp, setter) => {
    await Axios.post("https://conquerants.azurewebsites.net/inscription", {
      prenom: prenom,
      nom: nom,
      pseudo: pseudo,
      mot_passe: encrypt(mdp),
    },
    { withCredentials: true }
    ).then((response) => {
      if (response.data) {
        const { role, pseudo } = response.data;

        setConnecter(true);
        setAdmin(role === "ADMIN");
        setPseudoUser(pseudo);
        setter("");
      }
    }).catch(error => {
      const errorMsg = error.response ? error.response.data.message : 'An unexpected error occurred.';
      setter(errorMsg);
    });
  };

  const refreshConnexion = async () => {
    await Axios.get("https://conquerants.azurewebsites.net/refreshConnexion", 
      { withCredentials: true }
    ).then((response) => {
      if (response.data) {
        const { role, pseudo } = response.data;

        setConnecter(true);
        setAdmin(role === "ADMIN"); 
        setPseudoUser(pseudo);
      }
    }).catch(error => {
      const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred.';
      console.error(errorMessage);
    });
  };

  const handleDeconnexion = async () => {
    await Axios.get('https://conquerants.azurewebsites.net/deconnexion',
    { withCredentials: true }
    ).then(response => {
        setConnecter(false);
        setAdmin(false);
        setPseudoUser("");
    })
    .catch(error => {
        console.error('Error invalidating cookie:', error);
    });
  };

  if (pendingConnexion) {
    return <View style={styles.container}><Loading/></View>;
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Navbar langue={langue} langues={lang.langues} connecter={connecter} admin={admin} handleLangue={handleLangue}/>
        <Stack.Navigator>
          <Stack.Screen name="Accueil" component={Accueil} initialParams={{ langue }} />
          <Stack.Screen name="Equipes" component={Equipes} initialParams={{ langue, setSaison, saison }} />
          {/*<Stack.Screen name="Joueurs" component={Joueurs} initialParams={{ saisonFiltre: saison, setSaisonFiltre: setSaison, saisons, langue }} />
          <Stack.Screen name="Joueur" component={Joueur} initialParams={{ langue, langueStat: lang.fr }} />
          <Stack.Screen name="Matchs" component={Matchs} initialParams={{ saisonFiltre: saison, setSaisonFiltre: setSaison, saisons, langue }} />
          <Stack.Screen name="Predictions" component={Predictions} initialParams={{ langue, saisonFiltre: saison, setSaisonFiltre: setSaison, saisons }} />
          <Stack.Screen name="Connexion" component={Connexion} initialParams={{ langue, handleConnexion }} />
          <Stack.Screen name="Inscription" component={Inscription} initialParams={{ langue, handleInscription }} />
          <Stack.Screen name="Profil" component={Profil} initialParams={{ langue, handleDeconnexion, pseudo: pseudoUser }} />
          <Stack.Screen name="AjoutEquipes" component={AjoutEquipes} initialParams={{ langue }} />
          <Stack.Screen name="ModifEquipes" component={ModifEquipes} initialParams={{ langue }} />
          <Stack.Screen name="AjoutModifEquipe" component={AjoutModifEquipe} initialParams={{ langue }} />
          <Stack.Screen name="AjoutJoueurs" component={AjoutJoueurs} initialParams={{ langue }} />
          <Stack.Screen name="ModifJoueurs" component={ModifJoueurs} initialParams={{ langue }} />
          <Stack.Screen name="AjoutModifJoueur" component={AjoutModifJoueur} initialParams={{ langue }} />
          <Stack.Screen name="AjoutMatchs" component={AjoutMatchs} initialParams={{ langue }} />
          <Stack.Screen name="ModifMatchs" component={ModifMatchs} initialParams={{ langue }} />
          <Stack.Screen name="AjoutModifMatch" component={AjoutModifMatch} initialParams={{ langue }} />
          <Stack.Screen name="AjoutPartie" component={AjoutPartie} initialParams={{ langue, langueStat: lang.fr }} />
          <Stack.Screen name="Erreur" component={Erreur} initialParams={{ langue }} />*/}
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
