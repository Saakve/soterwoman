import { useState } from 'react'

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native'

import call from 'react-native-phone-call'

export default function Call () {
  const [phone, setPhone] = useState('9999999999')

  const triggerCall = () => {
    // Check for perfect 10 digit length
    if (phone.length !== 10) {
      Alert.alert('Please insert correct contact number')
      return
    }

    const args = {
      number: phone,
      prompt: true
    }
    // Make a call
    call(args).catch(console.error)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleTextsmall}>Enter Conatct Number to Call</Text>
        <TextInput
          value={phone}
          onChangeText={(phone) => setPhone(phone)}
          placeholder='Enter Conatct Number to Call'
          keyboardType='numeric'
          style={styles.textInput}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={triggerCall}
        >
          <Text style={styles.buttonTextStyle}>Call</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    textAlign: 'center'
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  titleTextsmall: {
    marginVertical: 8,
    fontSize: 16
  },
  buttonStyle: {
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#8ad24e'
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center'
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10
  }
})
