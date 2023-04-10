import { Button } from "@rneui/base";
import { useCallback, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const HEADERS = ['Toma un viaje seguro', 'Del destino a tu casa', 'Siempre Unidas']
const DESCRIPTIONS = [
    'Para mayor seguridad todas nuestras conductoras están capacitadas en caso de emergencia.', 
    'Todos nuestros viajes están controlados en tiempo real por lo que siempre sabrás donde estás.',
    'Sabemos lo importante que es para ti estar segura por lo que todas nuestras conductoras son mujeres como tú.'
]
const { height } = Dimensions.get('window')

SplashScreen.preventAutoHideAsync()

export function PassengerCarousel({ navigation, route }) {
    const page = route.params?.page || 0
    const [fontsLoaded] = useFonts({
        'OpenSans-Regular': require('../../assets/fonts/OpenSans/OpenSans-Regular.ttf'),
        'OpenSans-Bold': require('../../assets/fonts/OpenSans/OpenSans-Bold.ttf')
    })

    const onLayoutRootView = useCallback(async () => {
        if(fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    const handleOnPress = () => {
        if (page > 1) {
            navigation.navigate('AuthHome')
            return
        }

        navigation.push('PassengerCarousel', { page: page + 1})
    }

    const getImage = () => {
        if(page === 0) return require('../../assets/Passenger_1.png')
        if(page === 1) return require('../../assets/Passenger_2.png')
        if(page === 2) return require('../../assets/Passenger_3.png')
    }

    if(!fontsLoaded) return null

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.content}>
                <Image
                    source={getImage()}
                    style={styles.img}
                    resizeMode="contain"
                />
                <Text style={styles.header}>{HEADERS[page]}</Text>
                <Text style={styles.description}>{DESCRIPTIONS[page]}</Text>
                <Text style={styles.text}>{page}</Text>
            </View>
            <View style={styles.bttcontainer}>
                <Button
                    type="solid"
                    size="sm"
                    color="#8946A6"
                    icon={{
                        color: "white",
                        type: "font-awesome",
                        name: "arrow-right",
                    }}
                    onPress={() => handleOnPress()}
                    buttonStyle={{
                        width: 44,
                        height: 44,
                        alignSelf: "flex-end",
                        borderRadius: 50,
                        marginRight: 12
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        height,
        backgroundColor: "#FFF",
    },
    content: {
        marginHorizontal: 40,
        marginTop: 247
    },
    text: {
        color: 'black',
        textAlign: 'center'
    },
    header: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        textAlign: "center",
        marginBottom: 5
    },
    description: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        textAlign: "justify"
    },
    img: {
        height: 197,
        width: 302,
        alignSelf: "center"
    },
    bttcontainer: {
        marginBottom: 53
    }
})