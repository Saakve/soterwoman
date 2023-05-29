import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Switch } from 'react-native-elements'

export function ToggleOnService ({ onToggle = () => {} }) {
  const [onService, setOnService] = useState(false)

  const toggleSwitch = () => {
    onToggle(!onService)
    setOnService(previousState => !previousState)
  }

  const left = onService ? '51%' : '0%'

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, left }}>{onService ? 'ON' : 'OFF'}</Text>
      <Switch
        style={styles.switch}
        value={onService}
        onValueChange={toggleSwitch}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '7%',
    right: 30,
    zIndex: 1
  },
  switch: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    transform: [{ scale: 1.5 }],
    zIndex: -1
  },
  text: {
    position: 'relative',
    top: '50%',
    left: '52%',
    fontSize: 10,
    width: 30
  }
})
