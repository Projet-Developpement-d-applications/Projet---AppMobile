import React from 'react';
import { View, Picker } from 'react-native';

const Saison = ({ saisons, saison, setSaison, nomClass }) => {

    const handleChange = (value) => {
        const saisonTemp = JSON.parse(value);
        setSaison(saisonTemp);
    }

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={JSON.stringify(saison)}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => handleChange(itemValue)}>
                {saisons.map((saison, index) => (
                    <Picker.Item key={index} label={`${saison.debut}-${saison.fin}`} value={JSON.stringify(saison)} />
                ))}
            </Picker>
        </View>
    );
}

export default Saison;
