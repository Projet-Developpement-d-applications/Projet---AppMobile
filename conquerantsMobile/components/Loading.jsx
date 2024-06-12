import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

function Loading({ customClassName }) {
    const [className, setClassName] = useState(styles.loading);

    useEffect(() => {
        if (customClassName) {
            setClassName(customClassName);
        }
    }, [customClassName]);

    return (
        <View style={className}>
            <ActivityIndicator size="large" color="#d3333e" />
        </View>
    );
}

const styles = StyleSheet.create({
    loading: {
        backgroundColor: "#181818",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

// Export the Loading component
export default Loading;
