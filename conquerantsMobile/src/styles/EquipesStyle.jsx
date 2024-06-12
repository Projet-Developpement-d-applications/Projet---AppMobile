import { StyleSheet } from 'react-native';

const EquipesStyle = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '100vh',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 2000,
  },
  saisonEquipe: {
    position: 'absolute',
    right: '1rem',
    top: '8rem',
    borderRadius: 5,
    padding: '0.1rem',
    backgroundColor: '#101010',
    borderColor: '#181818',
    borderWidth: 2,
    color: '#f5f5f5',
  },
  titreJeu: {
    color: 'white',
    fontSize: '6rem',
    position: 'absolute',
    margin: 0,
    top: '63%',
    letterSpacing: 0.8,
    textAlign: 'center',
    width: '100%',
  },
  infoJeu: {
    marginTop: '5rem',
    marginBottom: '7rem',
    width: '60%',
    alignItems: 'center',
  },
  nomJeu: {
    fontSize: '3rem',
    marginBottom: '2rem',
    color: 'white',
  },
  nombreEquipe: {
    color: '#d3333e',
    fontSize: 16,
    marginBottom: '0.5rem',
  },
  descriptionJeu: {
    fontSize: 16,
    color: 'white',
  },
  nomEquipe: {
    fontSize: '3rem',
    color: 'white',
  },
  divisionEquipe: {
    color: '#d3333e',
    fontSize: 16,
    marginBottom: '0.5rem',
  },
  joueursContainer: {
    width: '80%',
    margin: 'auto',
    marginTop: '2rem',
    marginBottom: '5rem',
  },
  joueurCarte: {
    height: '30rem',
  },
  joueurBody: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 50,
  },
  joueurPseudo: {
    position: 'absolute',
    top: '20rem',
    color: 'white',
    fontSize: '2.5rem',
    fontWeight: '400',
  },
  slickSlide: {
    marginHorizontal: '1rem',
  },
  slickPrev: {
    color: '#f5f5f5',
    position: 'absolute',
    left: 0,
    top: '16rem',
    zIndex: 1,
  },
  slickNext: {
    color: '#f5f5f5',
    position: 'absolute',
    right: 0,
    top: '16rem',
    zIndex: 1,
  },
  slickDots: {
    position: 'absolute',
    bottom: '2rem',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  slickDot: {
    color: '#f5f5f5',
  },
});

export default EquipesStyle;
