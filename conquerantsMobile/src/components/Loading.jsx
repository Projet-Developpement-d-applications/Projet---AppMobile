import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import styles from '../styles/LoadingStyle';

function Loading({ customStyle }) {
    const [style, setStyle] = useState(styles.loading);

    useEffect(() => {
        if (customStyle) {
            setStyle([styles.loading, customStyle]);
        }
    }, [customStyle]);

    return (
        <View style={style}>
            <ActivityIndicator size="large" color="#d3333e" />
        </View>
    );
}

export default Loading;
