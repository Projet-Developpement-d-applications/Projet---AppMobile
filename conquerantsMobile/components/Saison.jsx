import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSaison } from '../Context/SaisonContext';

function Saison({ nomClass }) {
    const {saisons, setSaison, saison} = useSaison();

    const handleChange = (value) => {
        const saisonTemp = JSON.parse(value);
        setSaison(saisonTemp);
    };

    return (
        <View style={styles.selectionPickerContainer}>
            <Picker
                style={styles.picker}
                selectedValue={JSON.stringify(saison)}
                onValueChange={(itemValue) => handleChange(itemValue)}
                dropdownIconColor='#fff'>
                {saisons.map((saison, index) => (
                    <Picker.Item
                        key={index}
                        label={`${saison.debut}-${saison.fin}`}
                        value={JSON.stringify(saison)}
                    />
                ))}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: '#111',
        height: 40,
        marginBottom: 10,
    },
    picker: {
        color: '#fff',
    },
    selectionPickerContainer: {
        borderWidth: 3,
        borderColor: '#111',
        borderRadius: 15,
        height: 60,
        width: '100%',
        padding: 1,
    },
});

export default Saison;
