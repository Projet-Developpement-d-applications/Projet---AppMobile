import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Loading from '../components/Loading';
import { useLangue } from '../Context/LangueContext';
import { useAuth } from '../Context/AuthContext';
import { encrypt } from '../components/Encryption';
import { valideMdp } from '../components/Validation';

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
    const [loading, setLoading] = useState(connecter);

    useEffect(() => {
        const fetchUtilisateur = async () => {
            setLoading(true);

            try {
                const response = await Axios.get('https://conquerants.azurewebsites.net/utilisateurInfo', { withCredentials: true });
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
        if (valideMdp(mdpTemp, setMdpTempErreur, langue) && valideMdp(nouveauMdp, setNouveauMdpErreur, langue) && valideNomPrenom(prenom, setPrenomErreur, langue) && valideNomPrenom(nom, setNomErreur, langue)) {
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
                    }
                })
                .catch((error) => {
                    const errorMessage = error.response ? error.response.data : 'An unexpected error occurred.';
                    setModifStatus(errorMessage);
                    setModifErreur(true);
                    console.error('Error updating user info:', errorMessage);
                    stopModification();
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
                        <Picker.Item label="Français" value="fr" />
                        <Picker.Item label="English" value="en" />
                    </Picker>
                </View>
            </View>
            {connecter &&
                <View style={styles.profilContainer}>
                <Text style={styles.statusMessage}>{modifStatus}</Text>
                <Text>{langue.prenom}</Text>
                <Text style={styles.errorText}>{prenomErreur}</Text>
                <TextInput
                    style={styles.input}
                    value={prenom}
                    onChangeText={(text) => handleChangeNoSpace(text, setPrenom, setPrenomErreur)}
                    editable={false}
                />

                <Text>{langue.nom}</Text>
                <Text style={styles.errorText}>{nomErreur}</Text>
                <TextInput
                    style={styles.input}
                    value={nom}
                    onChangeText={(text) => handleChangeNoSpace(text, setNom, setNomErreur)}
                    editable={false}
                />

                <Text>{langue.pseudo}</Text>
                <TextInput
                    style={styles.input}
                    value={utilisateur.pseudo}
                    editable={false}
                />

                {!modification && (
                    <Button style={styles.button} onPress={() => setModification(true)} title={langue.profil.modif} />
                )}

                {modification && (
                    <View style={styles.modifProfil}>
                        <Text>{langue.profil.actuel}</Text>
                        <Text style={styles.errorText}>{mdpTempErreur}</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={mdpTemp}
                            onChangeText={(text) => handleMdp(text, setMdpTemp, setMdpTempErreur)}
                            editable={modification}
                        />
                        <Text>{langue.profil.nouveau}</Text>
                        <Text style={styles.errorText}>{nouveauMdpErreur}</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            onChangeText={(text) => handleMdp(text, setNouveauMdp, setNouveauMdpErreur)}
                            value={nouveauMdp}
                            editable={modification}
                        />

                        <Button style={styles.button} onPress={() => stopModification()} title={langue.profil.annuler} />
                        <Button style={styles.button} onPress={() => sauvegarderModification()} title={langue.profil.save} />
                    </View>
                )}

                <Button style={styles.button} onPress={logout} title={langue.profil.deconnexion} />
                {pendingDeconnexion && <Loading customClassName="loadingAuth" />}
            </View>
            }
        </View>
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
        width: '100%',
    },
    statusMessage: {
        color: 'red',
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    modifProfil: {
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
    },
});