import { View, StyleSheet, Text, Image, Platform } from 'react-native'
import { Button } from '@rneui/base'

export default function WaitSelector ({
  onPress = () => {}
}) {
  return (
    <View style={styles.selector}>
      <Image
        source={require('../../assets/waitImage.png')}
        style={styles.img}
        resizeMode='contain'
      />
      <View style={styles.text_cancel}>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
          Estamos buscando una conductora disponible, espera unos momentos...
        </Text>

        <Button
          title='Cancelar'
          buttonStyle={styles.button_cancel}
          onPress={onPress}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  selector: {
    width: '100%',
    height: '35%',
    position: 'absolute',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    bottom: Platform.select({ ios: '0%', android: '0%' })
  },
  img: {
    height: 185,
    width: 302,
    alignSelf: 'center'
  },
  text_cancel: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-between',
    width: '100%'
  },
  button_cancel: {
    borderRadius: 10,
    backgroundColor: '#8946A6',
    width: '90%'
  }
})
