import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, View, StyleSheet, Text, StatusBar } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import Accueil from '../screens/Accueil';
import Axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { faRectangleList } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import Settings from '../screens/Settings';
import { useLangue } from '../Context/LangueContext';
import { useAuth } from '../Context/AuthContext';
import Connexion from '../screens/Connexion';
import Inscription from './Inscription';

const Drawer = createDrawerNavigator();
const queryClient = new QueryClient();

export default function App() {
  const { langue } = useLangue();
  const { connecter } = useAuth();
  const [saison, setSaison] = useState("");
  const [saisons, setSaisons] = useState([]);

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

  return (
    <QueryClientProvider client={queryClient}>
    <NavigationContainer>
        <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#d3333e'
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
          <Drawer.Screen name={langue.navbar.accueil} component={Accueil} options={{
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
            <Drawer.Screen name={langue.navbar.settings} component={Settings} options={{
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon icon={faGear} size={20} color={color} />
            )}}/>
          </> :
          <>
            <Drawer.Screen name={langue.navbar.connexion} component={Connexion} options={{
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon icon={faUser} size={20} color={color} />
            )}}/>
            <Drawer.Screen name={langue.navbar.inscription} component={Inscription} options={{
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon icon={faUser} size={20} color={color} />
            )}}/>
            <Drawer.Screen name={langue.navbar.settings} component={Settings} options={{
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
          source={require('../images/banniere.png')} // Replace with your image path
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