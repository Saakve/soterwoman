import { View, Text, StyleSheet, Modal } from 'react-native'

import Avatar from './Avatar'

export function ModalDriverArrived({ visible = false, driver }) {

  return (
    <Modal
      animationType='fade'
      transparent
      visible={visible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <Avatar
              url={driver?.idimage}
              editable={false}
              size={60}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={styles.modalText}>{driver?.name}</Text>
            <Text style={styles.modalText}>¡Ya ha llegado a su origen!</Text>
          </View>
          <View style={styles.backgroundRight}></View>
          <View style={styles.backgroundLeft}></View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: "#8946A6",
    flexDirection: "row",
    borderRadius: 5,
    paddingVertical: "2%",
    paddingLeft: "2%",
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%"
  },
  modalText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    textAlign: 'left',
    marginHorizontal: 20,
    color: "#E6EAF2"
  },
  avatar: {
    marginTop: 0
  },
  backgroundRight: {
    position: "absolute",
    width: "15%",
    height: "70%",
    right:0,
    bottom: 0,
    backgroundColor: "rgba(183, 98, 193, 0.7)",
    borderTopLeftRadius: 100,
    borderBottomRightRadius: 10,
  },
  backgroundLeft: {
    position: "absolute",
    width: "15%",
    height: "70%",
    left:0,
    top: 0,
    backgroundColor: "rgba(183, 98, 193, 0.7)",
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 10,
    zIndex: -1
  }
})
