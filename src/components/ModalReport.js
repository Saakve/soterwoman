import { useContext, useState } from 'react'
import { View, Text, StyleSheet, Modal } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextInput } from 'react-native-gesture-handler'
import { Button } from '@rneui/base'

import { supabase } from '../services/supabase'

import UserContext from '../context/UserContext'

export function ModalReport ({ visible = false, onConfirm = () => {}, onCancel = () => {}, userToReport }) {
  const [description, setDescription] = useState('')
  const { userData } = useContext(UserContext)

  const handleCancel = async () => {
    onCancel()
  }

  const handleConfirm = async () => {
    const { error } = await supabase.from('report').insert({
      description,
      idpassenger: userToReport,
      iddriver: userData.id
    })

    console.log(error)
    subtractRating()
    onConfirm()
  }

  const subtractRating = async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('rating')
      .eq('id', userToReport)
    if (data[0].rating === 0) {
      if (error) console.log(error)
    } else {
      const { error } = await supabase.from('profile').update({ rating: data[0].rating - 1 })
        .eq('id', userToReport)
        .select()
      if (error) console.log(error)
    }
  }

  return (
    <Modal animationType='fade' transparent visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTitle}>
            <Text style={styles.modalText}>Describa su reporte</Text>
          </View>
          <View style={styles.modalDescription}>
            <TextInput
              style={styles.modalTextInput}
              value={description}
              editable
              multiline
              numberOfLines={10}
              maxLength={300}
              onChangeText={(description) => {
                setDescription(description)
              }}
              placeholder='Escribe tu comentario'
            />
          </View>
          <View style={styles.modalButtons}>
            <Button
              buttonStyle={styles.buttonCancel}
              onPress={handleCancel}
              title={<Icon name='cancel' size={20} color='#FFF' />}
              color={styles.buttonCancel.color}
            />
            <Button
              buttonStyle={styles.buttonReport}
              onPress={handleConfirm}
              title={<Icon name='check' size={20} color='#FFF' />}
              color={styles.buttonReport.color}
            />
          </View>
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
    marginBottom: '25%'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    paddingBottom: 20,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    backgroundColor: '#B762C1',
    padding: 20
  },
  modalText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    marginHorizontal: 20,
    width: 220,
    color: '#FFF'
  },
  modalTextInput: {
    padding: 20,
    height: 200,
    width: 220,
    borderWidth: 1,
    borderColor: '#C8C8C8'
  },
  modalDescription: {
    height: 220,
    maxWidth: 220,
    paddingTop: 20
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 60
  },
  buttonCancel: {
    marginTop: 20,
    height: 35,
    alignSelf: 'flex-start',
    borderRadius: 10,
    color: 'red',
    paddingHorizontal: 20
  },
  buttonReport: {
    marginTop: 20,
    height: 35,
    alignSelf: 'flex-end',
    borderRadius: 10,
    color: 'green',
    paddingHorizontal: 20
  }
})
