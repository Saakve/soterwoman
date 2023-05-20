import { createContext, useContext, useEffect, useState } from 'react'
import { View, Alert, StyleSheet, ScrollView, Text, Dimensions } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Button } from '@rneui/base'

import { useSignUp } from '../hooks/useSignUp'
import { InputStyled } from '../components/InputStyled.js'
import { GoBackButton } from '../components/GoBackButton'
import { validateDriverInputs, validateVehicleInputs } from '../utils/validateInputs'
import { ModalAfterSignUP } from '../components/ModalAfterSignUp'

const Stack = createNativeStackNavigator()
const AllInfoContex = createContext(null)
const { height } = Dimensions.get('window')

const DriverInfo = ({ navigation }) => {
  const { setAllInfo } = useContext(AllInfoContex)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [drivingLicense, setDrivingLicense] = useState('')
  const [city, setCity] = useState('')
  const [password, setPassword] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)

  const handlePressButton = async () => {
    setErrorMessage(null)
    try {
      await validateDriverInputs(name, email.toLowerCase(), phone, drivingLicense, city, password)
    } catch (error) {
      setErrorMessage(error)
      return
    }
    setAllInfo({ email, password, name, phone, drivingLicense, city })
    navigation.navigate('VehicleInfo')
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear nueva cuenta</Text>
        </View>
        <InputStyled
          name='name'
          placeholder='Nombre completo'
          value={name}
          onChangeText={text => setName(text)}
          inputMode='text'
          errorMessage={errorMessage}
        />
        <InputStyled
          name='email'
          placeholder='Correo electrónico'
          value={email}
          onChangeText={text => setEmail(text)}
          inputMode='email'
          errorMessage={errorMessage}
        />
        <InputStyled
          name='phone'
          placeholder='Teléfono'
          value={phone}
          onChangeText={text => setPhone(text)}
          inputMode='tel'
          errorMessage={errorMessage}
        />
        <InputStyled
          name='drivingLicense'
          placeholder='Número de licencia de conducir'
          value={drivingLicense}
          onChangeText={text => setDrivingLicense(text)}
          inputMode='text'
          errorMessage={errorMessage}
        />
        <InputStyled
          name='city'
          placeholder='Ciudad'
          value={city}
          onChangeText={text => setCity(text)}
          inputMode='text'
          errorMessage={errorMessage}
        />
        <InputStyled
          name='password'
          placeholder='Contraseña'
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
          inputMode='text'
          errorMessage={errorMessage}
        />
        <Button
          title='Siguiente'
          onPress={handlePressButton}
          color='#8946A6'
          buttonStyle={styles.button}
        />
      </View>
    </ScrollView>
  )
}

const VehicleInfo = ({ navigation }) => {
  const { isLoading: isLoadingSignUp, error: errorSignUp, signUp } = useSignUp({ usertype: 'driver' })
  const { allInfo } = useContext(AllInfoContex)

  const [model, setModel] = useState('')
  const [brand, setBrand] = useState('')
  const [year, setYear] = useState('')
  const [licensePlate, setLicensePlate] = useState('')

  const [showModal, setShowModal] = useState(false)

  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (errorSignUp) Alert.alert('Error', errorSignUp.message)
  }, [errorSignUp])

  const handlePressButton = async () => {
    setErrorMessage(null)
    try {
      await validateVehicleInputs(brand, model, year, licensePlate)
    } catch (error) {
      setErrorMessage(error)
      return
    }
    await signUp({ ...allInfo, brand, model, year, licensePlate })
    setShowModal(true)
  }

  const handlePressModal = () => {
    navigation.navigate('SignIn', { userType: 'driver' })
    setShowModal(false)
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <ModalAfterSignUP visible={showModal} onPress={handlePressModal} />
        <View style={styles.header}>
          <Text style={styles.title}>Detalles del vehículo</Text>
        </View>
        <InputStyled
          name='brand'
          placeholder='Marca'
          value={brand}
          onChangeText={text => setBrand(text)}
          inputMode='text'
          errorMessage={errorMessage}
        />
        <InputStyled
          name='model'
          placeholder='Modelo'
          value={model}
          onChangeText={text => setModel(text)}
          inputMode='text'
          errorMessage={errorMessage}
        />
        <InputStyled
          name='year'
          placeholder='Año'
          value={year}
          onChangeText={text => setYear(text)}
          inputMode='numeric'
          errorMessage={errorMessage}
        />
        <InputStyled
          name='licensePlate'
          placeholder='Número de la placa'
          value={licensePlate}
          onChangeText={text => setLicensePlate(text)}
          inputMode='text'
          errorMessage={errorMessage}
        />
        <Button
          title='Registrarse'
          disabled={isLoadingSignUp}
          onPress={handlePressButton}
          color='#8946A6'
          buttonStyle={styles.button}
        />
      </View>
    </ScrollView>
  )
}

export function SignUpDriver () {
  const [allInfo, setAllInfo] = useState({})

  return (
    <AllInfoContex.Provider value={{ allInfo, setAllInfo }}>
      <Stack.Navigator screenOptions={{
        headerShadowVisible: false,
        title: '',
        headerLeft: () => <GoBackButton />
      }}
      >
        <Stack.Screen name='DriverInfo' component={DriverInfo} />
        <Stack.Screen name='VehicleInfo' component={VehicleInfo} />
      </Stack.Navigator>
    </AllInfoContex.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height
  },
  header: {
    alignSelf: 'center',
    width: 335
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'left',
    fontSize: 24,
    marginBottom: 13
  },
  input: {
    borderColor: 'red',
    borderWidth: 2,
    marginHorizontal: 20
  },
  providers: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    marginTop: 20,
    color: '#8946A6',
    width: 330,
    height: 50,
    alignSelf: 'center',
    borderRadius: 10
  }
})
