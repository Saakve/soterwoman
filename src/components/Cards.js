import { StyleSheet, View, Text } from "react-native";
import { getCards } from "../services/stripe";
import { useState, useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Card } from "./Card";

export function Cards() {
    const [cards, setCards] = useState(null)

    useEffect(() => {
        getCardsForUser = async () => {
            const cards = await getCards({ id: 'acct_1N11tn2UWKvKuybi' })
            setCards(cards)
        }

        getCardsForUser()
    }, [])

    const handlePressCard = ({ id }) => {
        const newCards = cards.map( (card) => card.id === id 
            ? ({ ...card, isDefault: true })
            : ({ ...card, isDefault: false })
        )

        setCards(newCards)
    }

    const renderCard = ({ item }) => {
        const borderColor = item.isDefault ? "#hsla(220, 100%, 38%, 0.5)" : "#FFF"

        return <Card {...item} onPress={handlePressCard} borderColor={borderColor} />
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Tarjetas
            </Text>
            <View style={styles.cards}>
                <FlatList
                    data={cards}
                    renderItem={renderCard}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignContent: "center",
        backgroundColor: "#FFF"
    },
    text: {
        textAlign: "center",
        marginBottom: 10,
        fontFamily: "OpenSans-Bold",
        fontSize: 17
    },
    cards: {
        justifyContent: "space-around",
    },
    button: {
        marginTop: 20,
        color: "#8946A6",
        width: 330,
        height: 50,
        alignSelf: "center",
        borderRadius: 10
    }
})