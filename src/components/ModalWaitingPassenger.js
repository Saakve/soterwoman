import { View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native'

import { Button } from '@rneui/base'

export function ModalWaitingPassenger ({ visible = false, onPress = () => { } }) {
  const handlePressButton = () => {
    onPress()
  }

  return (
    <Modal
      animationType='fade'
      transparent
      visible={visible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size='large' color='#B762C1' />
          <Text style={[styles.modalText, styles.title]}>Esperando a pasajera</Text>
          <Button
            titleStyle={styles.textButton}
            buttonStyle={styles.buttonModal}
            onPress={handlePressButton}
            title='Iniciar viaje'
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
    marginTop: 22
  },
  modalView: {
    margin: 22,
    backgroundColor: '#8946A6',
    borderRadius: 25,
    width: '80%',
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
    marginBottom: 15,
    textAlign: 'center',
    marginHorizontal: 20,
    width: '100%',
    color: '#FFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 800
  },
  description: {
    fontSize: 14
  },
  textButton: {
    color: 'black',
    fontSize: 14
  },
  buttonModal: {
    marginTop: 20,
    height: 38,
    alignSelf: 'center',
    borderRadius: 10,
    color: '#FFCDDD',
    paddingHorizontal: 20
  },
  card: {
    flexDirection: 'row'
  },
  icon: {
    padding: 10,
    backgroundColor: '#FFCDDD',
    borderRadius: 100
  }
})
