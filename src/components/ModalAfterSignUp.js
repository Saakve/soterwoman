import { View, Text, StyleSheet, Modal } from 'react-native'
import { Button } from '@rneui/base'

export function ModalAfterSignUP ({ visible = false, onPress }) {
  return (
    <Modal
      animationType='fade'
      transparent
      visible={visible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Se ha enviado un correo de confirmación</Text>
          <Button buttonStyle={styles.buttonModal} onPress={onPress} title='Aceptar' color={styles.buttonModal.color} />
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
    marginTop: 22
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    marginHorizontal: 20,
    width: 180
  },
  buttonModal: {
    marginTop: 20,
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    color: '#8946A6',
    paddingHorizontal: 20
  }
})
