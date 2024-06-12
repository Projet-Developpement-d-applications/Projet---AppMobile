import { StyleSheet } from 'react-native';

const JoueursStyle = StyleSheet.create({
  titreJoueur: {
    marginVertical: '3rem',
    fontSize: '4rem',
  },
  rechercheContainer: {
    marginTop: '2rem',
  },
  selection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  select: {
    height: 40,
    backgroundColor: '#121212',
    borderColor: '#181818',
    borderRadius: 10,
    paddingLeft: 8,
    marginRight: 10,
    color: '#b5b5b5',
    width: 120,
  },
  formControl: {
    backgroundColor: '#121212',
    borderColor: 'transparent',
    borderRadius: 10,
    width: 120,
    height: 40,
    color: '#f5f5f5',
  },
  formControlFocus: {
    color: '#f5f5f5',
    backgroundColor: '#121212',
  },
  formControlPlaceholder: {
    color: '#b5b5b5',
  },
  tableauJoueurs: {
    marginTop: '2rem',
    marginBottom: '5rem',
    borderRadius: 15,
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#121212',
    color: '#f5f5f5',
    paddingVertical: '1rem',
    fontSize: '1.5rem',
    textAlign: 'center',
    width: 100,
  },
  td: {
    color: '#f5f5f5',
    backgroundColor: 'transparent',
    height: 30,
  },
  odd: {
    backgroundColor: '#141414',
  },
  even: {
    backgroundColor: '#171717',
  },
  trHover: {
    backgroundColor: 'rgba(211, 51, 62, 0.4)',
  },
  tr: {
    userSelect: 'none',
    verticalAlign: 'middle',
    cursor: 'pointer',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#111111',
    backgroundColor: '#171717',
  },
});

export default JoueursStyle;
