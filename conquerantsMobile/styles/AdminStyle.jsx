import { StyleSheet } from 'react-native';

const AdminStyle = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  erreur: {
    color: 'red',
  },
  succes: {
    color: 'green',
  },
  // You can define styles for each component
  registration: {
    ...container, // Reusing container style
  },
  login: {
    ...container,
  },
  ajoutEquipe: {
    ...container,
  },
  ajoutJoueurs: {
    ...container,
  },
  ajoutMatchs: {
    ...container,
  },
  modifEquipe: {
    ...container,
  },
  modifJoueur: {
    ...container,
  },
  modifMatch: {
    ...container,
  },
  ajoutPartie: {
    ...container,
  },
  profil: {
    ...container,
  },
});

export default AdminStyle;