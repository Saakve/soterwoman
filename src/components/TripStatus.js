import { View, StyleSheet, Text } from 'react-native'

export default function TripStatus ({ cost, status }) {
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.Text, textAlign: 'left', marginRight: '15%' }}>{cost}</Text>
      <Text style={{ ...styles.Text, textAlign: 'right' }}>{status === 1 ? 'Completado' : 'Cancelado'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    border: 2,
    borderRadius: 8,
    borderRadiusTop: 0,
    marginLeft: '2%',
    marginRight: '3%',
    borderWidth: 2,
    paddingVertical: 10,
    paddingLeft: '5%'
  },
  Text: {
    fontSize: 20,
    fontWeight: 'semibold',
    width: '40%'
  }
})
