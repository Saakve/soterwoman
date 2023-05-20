import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Switch } from 'react-native-elements'
import { supabase } from '../services/supabase'
import { makeChannel } from '../services/makeChannel'

export function ToggleOnService () {
  const [onService, setOnService] = useState(false)
  const [tripRequests, setTripRequest] = useState([])
  const [channel, setChannel] = useState(null)

  const toggleSwitch = () => {
    setOnService(previousState => !previousState)
  }

  useEffect(() => {
    if (onService) {
      const channel = makeChannel({
        eventType: 'broadcast',
        channelName: 'trips',
        filter: { event: 'request' },
        callback: response => setTripRequest(prevTripRequests => [...prevTripRequests, response.payload])
      })
      setChannel(channel)
    } else if (channel) {
      supabase.removeChannel(channel)
    }
  }, [onService])

  console.log(tripRequests)

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
    top: '9%',
    right: 30
  },
  switch: {
    backgroundColor: '#FFF',
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
