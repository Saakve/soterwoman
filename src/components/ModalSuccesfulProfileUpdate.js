import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Modal } from "react-native"

import { Button, Icon } from "@rneui/base"

import { useNavigation } from "@react-navigation/native"

export function ModalSuccessfulProfileUpdate({ visible = false, onPress = () => { } }) {
    const [show, setShow] = useState(visible)

    useEffect(() => {
        setShow(visible)
    }, [visible])

    const handlePressButton = () => {
        setShow(false)
        onPress()
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={show}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Icon
                        name="check"
                        type="font-awesome"
                        color="#8946A6"
                        size={90}
                        style={styles.icon}
                    />
                    <Text style={[styles.modalText, styles.title]}>Datos actualizados</Text>
                    <Text style={[styles.modalText, styles.description]}>
                        Recuerda siempre tener tus datos
                        actualizados para una mejor experiencia
                    </Text>
                    <Button
                        titleStyle={styles.textButton}
                        buttonStyle={styles.buttonModal}
                        onPress={handlePressButton}
                        title='Aceptar'
                        color={styles.buttonModal.color}
                    />
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
        backgroundColor: "#8946A6",
        borderRadius: 25,
        width: "80%",
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
        marginBottom: 15,
        textAlign: 'center',
        marginHorizontal: 20,
        width: "100%",
        color: "#FFF",
    },
    title: {
        fontSize: 24,
        fontWeight: 800
    },
    description: {
        fontSize: 14,
    },
    textButton: {
        color: 'black',
        fontSize: 14,
    },
    buttonModal: {
        marginTop: 20,
        height: 38,
        alignSelf: "center",
        borderRadius: 10,
        color: "#FFCDDD",
        paddingHorizontal: 20
    },
    card: {
        flexDirection: "row",
    },
    icon: {
        padding: 10,
        backgroundColor: "#FFCDDD",
        borderRadius: 100
    }
})