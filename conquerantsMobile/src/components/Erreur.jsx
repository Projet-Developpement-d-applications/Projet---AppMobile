import React from "react";
import { Text } from "react-native";

function Erreur({ langue }) {
    return (
        <Text>
            {langue.erreur}
        </Text>
    );
}

export default Erreur;