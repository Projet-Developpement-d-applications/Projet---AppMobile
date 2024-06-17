import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, View, StyleSheet } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import Accueil from '../screens/Accueil';
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
import Predictions from './Predictions';
import Matchs from './Matchs';
import Equipe from './Equipe';
import Joueurs from './Joueurs';

const Drawer = createDrawerNavigator();
const queryClient = new QueryClient();

export default function App() {
  const { langue } = useLangue();
  const { connecter } = useAuth();

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
          <Drawer.Screen name={langue.navbar.valo} component={Equipe} initialParams={{jeu: langue.navbar.valo}} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faGamepad} size={20} color={color} />
          )}}/>
          <Drawer.Screen name={langue.navbar.lol} component={Equipe} initialParams={{jeu: langue.navbar.lol}} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faGamepad} size={20} color={color} />
          )}}/>
          <Drawer.Screen name={langue.navbar.rl} component={Equipe} initialParams={{jeu: langue.navbar.rl}} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faGamepad} size={20} color={color} />
          )}}/>
          <Drawer.Screen name={langue.navbar.joueurs} component={Joueurs} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faPerson} size={20} color={color} />
          )}}/>
          <Drawer.Screen name={langue.navbar.matchs} component={Matchs} options={{
            drawerIcon: ({ color }) => (
              <FontAwesomeIcon icon={faRectangleList} size={20} color={color} />
          )}}/>
          {connecter ? 
          <>
            <Drawer.Screen name={langue.navbar.predictions} component={Predictions} options={{
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
          source={require('../images/banniere.png')}
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