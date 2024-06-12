import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Loading from '../components/Loading';
import { valideMdp, validePseudo } from '../components/Validation';
import { useAuth } from '../Context/AuthContext';
import { useLangue } from '../Context/LangueContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Connexion = () => {
    const { handleConnexion } = useAuth();
    const { langue } = useLangue();
    const [pseudo, setPseudo] = useState('');
    const [mdp, setMdp] = useState('');
    const [pseudoErreur, setPseudoErreur] = useState('');
    const [mdpErreur, setMdpErreur] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const goToInscriptionScreen = () => {
      const inscription = langue.navbar.inscription;
      navigation.navigate(inscription);
    };

    useFocusEffect(
      useCallback(() => {
        setMdpErreur('');
        setPseudoErreur('');
        setLoginStatus('');
        return () => {
        };
      }, [])
    );

    const login = () => {
        if (validePseudo(pseudo, setPseudoErreur, langue) & valideMdp(mdp, setMdpErreur, langue)) {
        setLoading(true);
        handleConnexion(pseudo, mdp, setLoginStatus).then(() => {
            setLoading(false);
        });
        }
    };

    const handleChange = (value, setter, valide, setterErreur) => {
        if (/\s/.test(value)) {
        return;
        }
        valide(value, setterErreur, langue);
        setter(value);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titre}>{langue.auth.connecter}</Text>
            <View style={styles.colInput}>
                <Text style={styles.info}>{loginStatus}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.customInput}
                    value={pseudo}
                    onChangeText={(text) => handleChange(text, setPseudo, validePseudo, setPseudoErreur)}
                    placeholder={langue.auth.email}
                    placeholderTextColor={'#FFF'}
                />
                <Text style={styles.info}>{pseudoErreur}</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.customInput}
                    value={mdp}
                    onChangeText={(text) => handleChange(text, setMdp, valideMdp, setMdpErreur)}
                    placeholder={langue.auth.mdp}
                    placeholderTextColor={'#FFF'}
                    secureTextEntry={true}
                />
                <Text style={styles.info}>{mdpErreur}</Text>
            </View>
            <View style={styles.ripple}>
                <Button
                    title={langue.auth.connexion}
                    disabled={loading}
                    onPress={login}
                    color="#d3333e"
                />
            </View>
            {loading && <Loading customClassName="loadingAuth" />}
        <TouchableOpacity onPress={goToInscriptionScreen}>
          <Text style={styles.lien}>{langue.auth.connexion_inscription}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    alignItems: 'center',
    width: '100%',
  },
  titre: {
    marginTop: '45%',
    marginBottom: 50,
    color: '#f5f5f5',
    fontSize: 28,
  },
  colInput: {
    alignItems: 'center',
    marginBottom: '5%',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '80%',
    margin: '1rem',
  },
  customInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: '#101010',
    color: '#f5f5f5',
    padding: 10,
  },
  ripple: {
    width: '80%',
    height: 50,
    margin: '1rem',
  },
  info: {
    color: '#d3333e',
    marginBottom: 4,
    textAlign: 'center',
  },
  lien: {
    color: '#f5f5f5',
    marginVertical: '1rem',
  },
});

export default Connexion;
