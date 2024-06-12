import { StyleSheet } from 'react-native';

const ProfilStyle = StyleSheet.create({
  profilContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#101010',
    width: '70%',
    borderWidth: 2,
    borderColor: '#141414',
    borderRadius: 15,
    padding: '1rem',
  },
  inputProfil: {
    width: '75%',
    marginBottom: '1rem',
    backgroundColor: '#141414',
    borderWidth: 2,
    borderColor: '#f5f5f5',
    borderRadius: 15,
    padding: '0.5rem 1rem',
    color: '#f5f5f5',
  },
  disabledInputProfil: {
    borderColor: '#181818',
    cursor: 'not-allowed',
  },
  lastButton: {
    marginTop: '2rem',
  },
  buttonProfil: {
    width: '75%',
    marginBottom: '1rem',
  },
  modifProfil: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
  },
});

export default ProfilStyle;
