import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StatusBar } from "react-native";
import { s } from "react-native-wind";

const LoadingScreen = ({ navigation }) => {
    useEffect(() => {
        // Replace this with actual loading logic
        const timer = setTimeout(() => {
            navigation.replace("Home");
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer); // cleanup on unmount
    }, [navigation]);

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <View style={s`flex-1 items-center justify-center`}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        </>
    );
};

export default LoadingScreen;
