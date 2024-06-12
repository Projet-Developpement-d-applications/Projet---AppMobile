import { StyleSheet } from 'react-native';

const AuthStyle = StyleSheet.create({
  body: {
    backgroundColor: '#181818',
  },
  titre: {
    marginTop: '10rem',
    color: '#f5f5f5',
    marginBottom: '2rem',
  },
  loadingAuth: {
    backgroundColor: 'inherit',
    marginVertical: '1rem',
  },
  container: {
    width: 1000,
    height: 'auto',
    backgroundColor: '#101010',
    borderRadius: 25,
    marginBottom: '5rem',
  },
  label: {
    color: '#f5f5f5',
  },
  row: {
    height: '100%',
  },
  col: {
    padding: 0,
    margin: 0,
  },
  colImage: {
    borderRadius: '25px 0 0 25px',
    backgroundColor: '#f5f5f5',
    margin: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 50,
    },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 5,
  },
  colInput: {
    marginBottom: '5rem',
  },
  image: {
    width: '80%',
    height: 'auto',
  },
  inputContainer: {
    position: 'relative',
  },
  customInput: {
    width: '80%',
    display: 'inline-block',
    margin: '1rem',
    borderWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: '#101010',
    color: '#f5f5f5',
    outline: 'none',
  },
  inputHolder: {
    color: '#f5f5f5',
    position: 'absolute',
    pointerEvents: 'none',
    left: '11.5%',
    top: '1.45rem',
    transition: '0.2s ease-in-out',
    padding: '0px 3px',
    backgroundColor: '#101010',
  },
  customButton: {
    backgroundColor: '#d3333e',
    borderColor: '#d3333e',
    color: '#f5f5f5',
    width: '100%',
  },
  lien: {
    display: 'block',
    color: '#f5f5f5',
  },
  ripple: {
    width: '80%',
    height: '3rem',
    margin: '1rem',
  },
  info: {
    display: 'block',
  },
});

export default AuthStyle;