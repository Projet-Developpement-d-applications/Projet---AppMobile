import { StyleSheet } from 'react-native';

const JoueurStyle = StyleSheet.create({
  joueurContent: {
    color: '#f5f5f5',
  },
  profilJoueur: {
    overflow: 'hidden',
    width: 160,
    height: 160,
    borderRadius: 80,
    marginLeft: '10%',
    padding: 0,
    borderWidth: 1,
    borderColor: '#101010',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageJoueur: {
    width: 'auto',
    height: '100%',
    resizeMode: 'contain',
  },
  joueurInfo: {
    display: 'flex',
    width: '100%',
    padding: '2rem',
    backgroundColor: 'rgba(211, 51, 62, 0.3)',
  },
  joueurText: {
    marginLeft: '3rem',
    marginTop: '0.5rem',
    textAlign: 'left',
  },
  joueurP: {
    margin: '0.25rem',
    marginLeft: 0,
  },
  joueurStats: {
    marginBottom: 0,
  },
  joueurStatsTh: {
    backgroundColor: '#121212',
    color: '#f5f5f5',
    minWidth: 100,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
  },
  joueurStatsTd: {
    backgroundColor: '#f5f5f5',
    fontWeight: '500',
    textAlign: 'center',
  },
  fillJoueur: {
    height: 120,
    padding: 0,
    marginVertical: '5rem',
    marginHorizontal: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillTable: {
    borderRadius: 15,
    margin: 0,
  },
  fillTableTh: {
    fontSize: '1rem',
  },
});

export default JoueurStyle;
