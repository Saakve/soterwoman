import { Button } from "@rneui/base"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, Dimensions } from "react-native"
import { getData, storeData } from "../utils/manageDataOnDevice"
import { AuthHome } from "./AuthHome"

const HEADERS = ['Ofrece un viaje seguro', 'Incrementa tus ingresos', 'Manten tu ritmo']
const DESCRIPTIONS = [
    'Se una de nuestras conductoras y ayudanos en ofrecer un servicio donde todas llegemos a casa.',
    'Aprovecha tu vehiculo y conviertete en nuestra socia, ofrecemos buen retorno monetario por cada viaje.',
    'Aprovecha tus tiempos libres traslandando a las clientas de la app sin afectar tu tiempo laboral.'
]
const { height } = Dimensions.get('window')

export function DriverCarousel({ navigation, route }) {
    const [page, setPage] = useState(route.params?.page || 0)

    const handleOnPress = () => {
        navigation.push('DriverCarousel', { page: page + 1 })
    }

    const getImage = () => {
        if (page === 0) return require('../../assets/Driver_1.png')
        if (page === 1) return require('../../assets/Driver_2.png')
        if (page === 2) return require('../../assets/Driver_3.png')
    }

    useEffect(() => {
        if(route.params?.animation) navigation.setOptions({ animation: route.params.animation })

        const hasBeenViewed = async () => {
            const value = await getData('DriverCarouselviewed')
            if (value) {
                setPage(2) 
            } else if (page === 2) {
                await storeData('DriverCarouselviewed', 'y')
            }
        }
        hasBeenViewed()
    }, [])

    return (
        <View style={styles.container} >
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
                {
                    page === 2
                        ?
                        <AuthHome navigation={navigation} userType={'driver'}/>
                        :
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
                }
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