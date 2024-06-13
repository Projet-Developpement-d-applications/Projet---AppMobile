import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Loading from '../components/Loading';
import { useLangue } from '../Context/LangueContext';
import { useAuth } from '../Context/AuthContext';
import { encrypt } from '../components/Encryption';
import { valideMdp } from '../components/Validation';
import Axios from 'axios';

const Settings = () => {
    const { langue, handleLangue } = useLangue();
    const { connecter, handleDeconnexion } = useAuth();

    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [mdpTemp, setMdpTemp] = useState('');
    const [nouveauMdp, setNouveauMdp] = useState('');
    const [prenomErreur, setPrenomErreur] = useState('');
    const [nomErreur, setNomErreur] = useState('');
    const [mdpTempErreur, setMdpTempErreur] = useState('');
    const [nouveauMdpErreur, setNouveauMdpErreur] = useState('');
    const [modifStatus, setModifStatus] = useState('');
    const [modifErreur, setModifErreur] = useState(false);
    const [modification, setModification] = useState(false);
    const [utilisateur, setUtilisateur] = useState({ pseudo: '', role: '' });
    const [pendingDeconnexion, setPendingDeconnexion] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUtilisateur = async () => {
            setLoading(true);

            try {
                const response = await Axios.get('https://conquerants.azurewebsites.net/utilisateurInfo',
                { withCredentials: true });
                if (response.data) {
                    setUtilisateur(response.data);
                    setPrenom(response.data.prenom);
                    setNom(response.data.nom);
                }
                setLoading(false);
            } catch (error) {
                const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred.';
                setLoading(false);
                console.error('Error fetching user info:', errorMessage);
            }
        };

        if (connecter) {
            fetchUtilisateur();
        }
    }, [connecter]);

    const logout = () => {
        setPendingDeconnexion(true);
        handleDeconnexion();
    };

    const sauvegarderModification = () => {
        if (valideMdp(mdpTemp, setMdpTempErreur, langue) & valideMdp(nouveauMdp, setNouveauMdpErreur, langue)) {
            setLoading(true);
            Axios.put(
                'https://conquerants.azurewebsites.net/modifierUtilisateur',
                { ancien_mdp: encrypt(mdpTemp), nouveau_mdp: encrypt(nouveauMdp) },
                { withCredentials: true }
            )
                .then((response) => {
                    if (response.data) {
                        setModifStatus(response.data);
                        setModifErreur(false);
                        setTimeout(() => {
                            setModifStatus('');
                        }, 2000);
                        stopModification();
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    const errorMessage = error.response ? error.response.data : 'An unexpected error occurred.';
                    setModifStatus(errorMessage);
                    setModifErreur(true);
                    stopModification();
                    setLoading(false);
                });
        }
    };

    const handleChangeNoSpace = (value, setter, setterErreur) => {
        if (/\s/g.test(value)) {
            return;
        }
        valideNomPrenom(value, setterErreur, langue);
        setter(value);
    };

    const handleMdp = (value, setter, setterErreur) => {
        valideMdp(value, setterErreur, langue);
        setter(value);
    };

    const stopModification = () => {
        setPrenom(utilisateur.prenom);
        setNom(utilisateur.nom);
        setModification(false);
        setMdpTemp('');
        setNouveauMdp('');
        setMdpTempErreur('');
        setNouveauMdpErreur('');
        setNomErreur('');
        setPrenomErreur('');
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <ScrollView style={{backgroundColor: '#111'}} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <Text style={styles.text}>{langue.choix}</Text>
                <View style={styles.pickerBlock}>
                    <Picker
                        selectedValue={langue.type}
                        onValueChange={(value) => handleLangue(value)}
                        style={styles.picker}
                        dropdownIconColor='#fff'
                    >
                        <Picker.Item label="Français" value='fr' />
                        <Picker.Item label="English" value="en" />
                    </Picker>
                </View>
            </View>
            {connecter &&
                <View style={styles.profilContainer}>
                <Text style={styles.profilTitle}>{langue.profil.h1}</Text>
                <Text style={styles.statusMessage}>{modifStatus}</Text>
                <Text style={styles.profilLabel}>{langue.prenom}</Text>
                <TextInput
                    style={styles.input}
                    value={prenom}
                    onChangeText={(text) => handleChangeNoSpace(text, setPrenom, setPrenomErreur)}
                    editable={false}
                />

                <Text style={styles.profilLabel}>{langue.nom}</Text>
                <TextInput
                    style={styles.input}
                    value={nom}
                    onChangeText={(text) => handleChangeNoSpace(text, setNom, setNomErreur)}
                    editable={false}
                />

                <Text style={styles.profilLabel}>{langue.pseudo}</Text>
                <TextInput
                    style={styles.input}
                    value={utilisateur.pseudo}
                    editable={false}
                />

                {!modification && (
                    <View style={styles.space}>
                        <Button color="#d3333e" style={styles.button} onPress={() => setModification(true)} title={langue.profil.modif} />
                    </View>
                )}

                {modification && (
                    <View style={styles.modifProfil}>
                        <Text style={styles.profilLabel}>{langue.profil.actuel}</Text>
                        <TextInput
                            style={styles.inputMdp}
                            secureTextEntry
                            value={mdpTemp}
                            onChangeText={(text) => handleMdp(text, setMdpTemp, setMdpTempErreur)}
                            editable={modification}
                        />
                        {mdpTempErreur && <Text style={styles.errorText}>{mdpTempErreur}</Text>}

                        <Text style={styles.profilLabel}>{langue.profil.nouveau}</Text>
                        <TextInput
                            style={styles.inputMdp}
                            secureTextEntry
                            onChangeText={(text) => handleMdp(text, setNouveauMdp, setNouveauMdpErreur)}
                            value={nouveauMdp}
                            editable={modification}
                        />
                        {nouveauMdpErreur && <Text style={styles.errorText}>{nouveauMdpErreur}</Text>}
                        <View style={styles.space}>
                            <Button color="#d3333e" style={styles.button} onPress={() => stopModification()} title={langue.profil.annuler} />
                        </View>
                        <View style={styles.space}>
                            <Button color="#d3333e" style={styles.button} onPress={() => sauvegarderModification()} title={langue.profil.save} />
                        </View>
                    </View>
                )}
                <View style={styles.space}>
                    <Button style={styles.button} color="#d3333e" onPress={logout} title={langue.profil.deconnexion} />
                </View>
                {(pendingDeconnexion || loading) && <Loading customClassName="loadingAuth" />}
            </View>
            }
        </View>
        </ScrollView>
    )
}

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#111',
    },
    pickerContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50,
        maxHeight: 110,
    },
    pickerBlock: {
        width: '100%',
        backgroundColor: '#000',
        padding: 0,
        borderRadius: 15,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        color: '#fff',
    },
    picker: {
        width: 200,
        color: '#fff',
        marginBottom: 0,
    },
    profilContainer: {
        width: '80%',
        marginTop: '5%',
        marginBottom: '10%',
    },
    profilTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    profilLabel: {
        color: '#FFF',
    },
    statusMessage: {
        color: 'red',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#FFF',
        backgroundColor: '#101010',
        color: '#f5f5f5',
        padding: 10,
    },
    inputMdp: {
        height: 40,
        borderWidth: 1,
        borderColor: '#d3333e',
        backgroundColor: '#101010',
        color: '#f5f5f5',
        padding: 10,
    },
    button: {
        marginTop: 10,
    },
    space: {
        marginTop: 10,
    },
});