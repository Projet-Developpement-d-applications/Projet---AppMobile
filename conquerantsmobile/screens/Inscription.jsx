import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../Context/AuthContext';
import { useLangue } from '../Context/LangueContext';
import { valideMdp, valideNomPrenom, validePseudo } from '../components/Validation';
import Loading from '../components/Loading';
import { useNavigation } from '@react-navigation/native';

const Inscription = () => {
    const { handleInscription } = useAuth();
    const { langue } = useLangue();

    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [mdp, setMdp] = useState("");
    const [loading, setLoading] = useState(false);

    const [pseudoErreur, setPseudoErreur] = useState("");
    const [prenomErreur, setPrenomErreur] = useState("");
    const [nomErreur, setNomErreur] = useState("");
    const [mdpErreur, setMdpErreur] = useState("");

    const [registerStatus, setRegisterStatus] = useState("");

    const navigation = useNavigation();

    const goToConnexionScreen = () => {
        const connexion = langue.navbar.connexion;
      navigation.navigate(connexion);
    };

    const register = () => {
        if (validePseudo(pseudo, setPseudoErreur, langue) & valideMdp(mdp, setMdpErreur, langue) & valideNomPrenom(nom, setNomErreur, langue) & valideNomPrenom(prenom, setPrenomErreur, langue)) {
            setLoading(true);
            handleInscription(prenom, nom, pseudo, mdp, setRegisterStatus).then(() => {
                setLoading(false);
            });
        }
    };

    const handleChange = (value, setter, valide, setterErreur) => {
        if ((/\s/g).test(value)) {
            return;
        }

        valide(value, setterErreur, langue);
        setter(value);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titre}>{langue.auth.inscrire}</Text>
            <View style={styles.container}>
                <Text style={styles.error}>{registerStatus}</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={prenom}
                        onChangeText={(text) => handleChange(text, setPrenom, valideNomPrenom, setPrenomErreur)}
                        placeholder={langue.prenom}
                        placeholderTextColor={'#FFF'}
                    />
                    <Text style={styles.error}>{prenomErreur}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={nom}
                        onChangeText={(text) => handleChange(text, setNom, valideNomPrenom, setNomErreur)}
                        placeholder={langue.nom}
                        placeholderTextColor={'#FFF'}
                    />
                    <Text style={styles.error}>{nomErreur}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={pseudo}
                        onChangeText={(text) => handleChange(text, setPseudo, validePseudo, setPseudoErreur)}
                        placeholder={langue.auth.email}
                        placeholderTextColor={'#FFF'}
                    />
                    <Text style={styles.error}>{pseudoErreur}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={mdp}
                        onChangeText={(text) => handleChange(text, setMdp, valideMdp, setMdpErreur)}
                        placeholder={langue.auth.mdp}
                        placeholderTextColor={'#FFF'}
                        secureTextEntry={true}
                    />
                    <Text style={styles.error}>{mdpErreur}</Text>
                </View>
                <TouchableOpacity disabled={loading} style={styles.button} onPress={register}>
                    <Text style={styles.buttonText}>{langue.auth.inscription}</Text>
                </TouchableOpacity>
                {loading && <Loading customClassName="loadingAuth" />}
                <TouchableOpacity onPress={goToConnexionScreen} style={styles.link}>
                    <Text style={styles.linkText}>{langue.auth.inscription_connexion}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    titre: {
        fontSize: 24,
        backgroundColor: '#181818',
        color: '#f5f5f5',
        textAlign: 'center',
        marginTop: 20,
      },
      container: {
        flex: 1,
        backgroundColor: '#181818',
        paddingHorizontal: 20,
        width: '100%',
      },
      image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
      },
      error: {
        color: 'red',
        marginBottom: 10,
      },
      inputContainer: {
        marginBottom: 10,
      },
      input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#f5f5f5',
        backgroundColor: '#101010',
        color: '#f5f5f5',
        padding: 10,
      },
      button: {
        backgroundColor: '#d3333e',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
      },
      link: {
        alignItems: 'center',
      },
      linkText: {
        color: '#f5f5f5',
        fontSize: 16,
      }
  });

export default Inscription;