import React from "react";
import { View, StyleSheet } from "react-native";

function Erreur() {
    return (
        <View style={styles.erreur}>
            <Text style={styles.text}>Erreur...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    erreur: {
        backgroundColor: "#181818",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: '#d3333e',
    },
});

export default Erreur;
