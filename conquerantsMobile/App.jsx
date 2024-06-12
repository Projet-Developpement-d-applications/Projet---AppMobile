import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, View, StyleSheet, Text, StatusBar } from 'react-native';
import DashboardScreen from './screens/DashboardScreen';
import Accueil from './screens/Accueil';
import lang from './json/lang.json';
import Axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { faRectangleList } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import Loading from './components/Loading';

const Drawer = createDrawerNavigator();
const queryClient = new QueryClient();

export default function App() {
  const [langue, setLangue] = useState(lang.fr);
  const [connecter, setConnecter] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [saison, setSaison] = useState("");
  const [saisons, setSaisons] = useState([]);
  const [pseudoUser, setPseudoUser] = useState("");
  const [pendingConnexion, setPendingConnexion] = useState(true);

  const creerCookieLangue = async () => {
    try {
      await CookieManager.set('http://localhost', {
        name: 'langue',
        value: langue.type,
        expires: '365'});
    } catch (error) {
      console.error('Error setting language in cookies:', error);
    }
  }

  const handleLangue = (langue) => {
    if (langue === "fr") {
      setLangue(lang.fr);
    } else {
      setLangue(lang.en);
    }

    creerCookieLangue(langue);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const saisonsResponse = await Axios.get('https://conquerants.azurewebsites.net/noAuth/saisons');
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
      try {
        const response = await Axios.get("https://conquerants.azurewebsites.net/connexionStatus", { withCredentials: true });
        if (response.data === true) {
          setConnecter(true);
          refreshConnexion().then(() => setPendingConnexion(false));
        } else {
          setConnecter(false);
          handleDeconnexion().then(() => setPendingConnexion(false));
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
        setConnecter(false);
        setPendingConnexion(false);
      }
    }

    const getCookieLangue = async () => {
      try {
        const langueTemp = await CookieManager.get('http://localhost');
        if (langueTemp.langue) {
          handleLangue(langueTemp.langue.value);
        }
      } catch (error) {
        console.error('Error getting language from cookies:', error);
      }
    }

    if (pendingConnexion) {
      valideInfoConnexion();
      getCookieLangue();
    }
  }, [pendingConnexion]);

  const handleConnexion = async (pseudo, mdp, setter) => {
    try {
      const response = await Axios.post("https://conquerants.azurewebsites.net/connexion", { pseudo: pseudo, mot_passe: encrypt(mdp) }, { withCredentials: true });
      if (response.data) {
        const { role, pseudo } = response.data;
        setConnecter(true);
        setAdmin(role === "ADMIN");
        setPseudoUser(pseudo);
      }
      setter("");
    } catch (error) {
      const errorMsg = error.response ? error.response.data.message : 'An unexpected error occurred.';
      setter(errorMsg);
    }
  }

  const handleDeconnexion = async () => {
    await Axios.get('https://conquerants.azurewebsites.net/deconnexion',
    {withCredentials: true}
    ).then(response => {
        setConnecter(false);
        setAdmin(false);
        setPseudoUser("");
    })
    .catch(error => {
        console.error('Error invalidating cookie:', error);
    });
  }

  if (pendingConnexion) {
    return <Loading />
  }

  return (
    <QueryClientProvider client={queryClient}>
    <NavigationContainer>
        <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6e171d'
          },
          headerTintColor: '#f5f5f5',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerStyle: {
            backgroundColor: '#181818',
          },
          drawerActiveTintColor: '#d3333e',
          drawerInactiveTintColor: '#f5f5f5',
        }}
      >
          <Drawer.Screen name={langue.navbar.accueil} component={Accueil} initialParams={{langue: langue}} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={20} color={color} />
          )}}/>
          <Drawer.Screen name={langue.navbar.valo} component={DashboardScreen} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faGamepad} size={20} color={color} />
          )}}/>
          <Drawer.Screen name={langue.navbar.lol} component={DashboardScreen} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faGamepad} size={20} color={color} />
          )}}/>
          <Drawer.Screen name={langue.navbar.rl} component={DashboardScreen} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faGamepad} size={20} color={color} />
          )}}/>
          <Drawer.Screen name={langue.navbar.joueurs} component={DashboardScreen} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faPerson} size={20} color={color} />
          )}}/>
          <Drawer.Screen name={langue.navbar.matchs} component={DashboardScreen} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faRectangleList} size={20} color={color} />
          )}}/>
          {connecter ? 
          <>
            <Drawer.Screen name={langue.navbar.predictions} component={DashboardScreen} options={{
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon icon={faDice} size={20} color={color} />
            )}}/>
            <Drawer.Screen name={langue.navbar.settings} component={DashboardScreen} options={{
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon icon={faGear} size={20} color={color} />
            )}}/>
          </> :
          <>
            <Drawer.Screen name={langue.navbar.connexion} component={DashboardScreen} options={{
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon icon={faUser} size={20} color={color} />
            )}}/>
            <Drawer.Screen name={langue.navbar.settings} component={DashboardScreen} options={{
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon icon={faGear} size={20} color={color} />
            )}}/>
          </>}
        </Drawer.Navigator>
    </NavigationContainer>
    </QueryClientProvider>
  )
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./images/banniere.png')} // Replace with your image path
          style={styles.image}
        />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 290,
    height: 150,
    resizeMode: 'contain',
  },
});