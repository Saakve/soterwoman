import { View, StyleSheet, Text } from 'react-native'
import { Icon, Button } from '@rneui/base'

export default function WonderType ({ name, price, onPress = () => {} }) {
  return (
    <View style={styles.wondertypes}>
      <Button
        icon={
          <Icon
            style={styles.wondertypes_data_icons}
            name='car-side'
            type='font-awesome-5'
            color='#242E42'
          />
          }
        title={`Wonder ${name[0].toUpperCase() + name.substring(1)}`}
        titleStyle={{ color: '#111' }}
        buttonStyle={styles.button}
        onPress={onPress}
      />
      <Text style={{ fontSize: 18 }}>{`${price}`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wondertypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 360
  },
  wondertypes_data_icons: {
    marginHorizontal: '5%'
  },
  button: {
    borderRadius: 10,
    maxWidth: 280,
    height: 40,
    backgroundColor: '#FFF'
  }
})
