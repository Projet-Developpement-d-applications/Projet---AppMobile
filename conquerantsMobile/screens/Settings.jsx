import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLangue } from '../Context/LangueContext';

const Settings = () => {
    const { langue, handleLangue } = useLangue();

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
    },
});