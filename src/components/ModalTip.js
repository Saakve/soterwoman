import { View, Text, StyleSheet, Modal } from "react-native"
import { Button } from "@rneui/base"
import { useContext, useEffect, useState } from "react"
import { createTipIntent } from "../services/stripe"
import UserContext from '../context/UserContext'
import { confirmPayment, initStripe } from "@stripe/stripe-react-native"
import { getPublishableKey } from "../services/getPublishableKey"

function TipButton({ pressed = false, onPress, value }) {
    const color = pressed ? '#FFCDDD' : "#FFF"
    const borderColor = pressed ? "#FFF" : "#000"

    return (
        <Button
            titleStyle={styles.tiptitle}
            buttonStyle={styles.tip}
            containerStyle={{ ...styles.tipContainer, borderColor }}
            onPress={onPress}
            color={color}
            title={`$${value}`}
        />
    )
}

export function ModalTip({ visible = false, onPress = () => { }, driverToSendTip }) {
    const { userData } = useContext(UserContext)
    const [amount, setAmount] = useState(0)
    const [show, setShow] = useState(visible)

    const amounts = [0, 10, 20, 30]

    const handlePressButton = async () => {
        setShow(false)

        const { tipIntent } = await createTipIntent({ idCustomer: userData.idStripe, idAccount: driverToSendTip, amount: amount * 100 })
        console.log(tipIntent)
        const { paymentIntent, error } = await confirmPayment(tipIntent)
        console.log(error, paymentIntent)
        onPress()
    }

    useEffect(() => {
        fetchKey = async () => {
            const publishableKey = await getPublishableKey()
            await initStripe({ publishableKey })
        }
        fetchKey()
    }, [])

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={show}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Si lo deseas, agrega una propina</Text>
                    <View style={styles.stars}>
                        {amounts.map((value, index) => <TipButton key={index} pressed={value === amount} onPress={() => setAmount(value)} value={value} />)}
                    </View>
                    <Button titleStyle={styles.textButton} buttonStyle={styles.buttonModal} onPress={handlePressButton} title='Aceptar' color={styles.buttonModal.color} />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 22,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: 30,
        paddingHorizontal: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        fontFamily: "OpenSans-Regular",
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
        marginHorizontal: 20,
        width: 180
    },
    textButton: {
        color: 'black',
        fontSize: 14,
    },
    buttonModal: {
        marginTop: 20,
        height: 35,
        alignSelf: "center",
        borderRadius: 10,
        color: "#FFCDDD",
        paddingHorizontal: 20
    },
    stars: {
        flexDirection: "row",
        columnGap: 0
    },
    tip: {
        // backgroundColor: "#FFF",
        color: "#FDCD03",
        width: 50,
        height: 50,
        borderWidth: 0
    },
    tipContainer: {
        borderRadius: 50,
        marginHorizontal: "1%",
        borderWidth: 1,
    },
    tiptitle: {
        fontSize: 15,
        color: "#111",
    }
})