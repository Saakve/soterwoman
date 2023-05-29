import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native'
import Thumbnail from '../components/Avatar'
import { supabase } from '../services/supabase'
import UserContext from '../context/UserContext'
import { Button } from '@rneui/themed'
import { Icon } from 'react-native-elements'
import {
  validateCity,
  validateDrivingLicenseAndCity,
  validateEmail,
  validateEmergencyPhone,
  validateName,
  validatePhone
} from '../utils/validateInputs'
import { InputStyled } from '../components/InputStyled.js'
import { ModalSuccessfulProfileUpdate } from '../components/ModalSuccesfulProfileUpdate'

export default function ProfileDetails ({ navigation }) {
  const { userData } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [save, setSave] = useState(false)
  const [email, setEmail] = useState(userData.email)
  const [name, setName] = useState(userData.name)
  const [phone, setPhone] = useState(userData.phone)
  const [emergencyPhone, setEmergencyPhone] = useState(userData.emergencyPhone)
  const [drivingLicense, setDrivingLicense] = useState(userData.drivingLicense)
  const [city, setCity] = useState(userData.city)

  const [errorMessage, setErrorMessage] = useState(null)
  const [validatedDrivingLicense, setValidatedDrivingLicense] = useState(
    validatedDrivingLicense
  )

  useEffect(() => {
    const userType = userData.idUserType === 1 ? 'driver' : 'passenger'
    if (userType === 'passenger') {
      const getPassenger = async () => {
        const { data } = await supabase
          .from('passenger')
          .select('emergencyphone')
          .eq('id', userData.id)
        setEmergencyPhone(data[0].emergencyphone)
      }
      getPassenger()
    } else if (userType === 'driver') {
      const getDriver = async () => {
        const { data } = await supabase
          .from('driver')
          .select('city, drivinglicense')
          .eq('id', userData.id)
        setDrivingLicense(data[0].drivinglicense)
        setValidatedDrivingLicense(data[0].drivinglicense)
        setCity(data[0].city)
      }
      getDriver()
    }
  }, [])

  const updateData = async () => {
    setErrorMessage(null)
    setLoading(true)
    try {
      validateName(name)

      if (email !== userData.email) {
        await validateEmail(email.trim())
      }
      if (phone !== userData.phone) {
        await validatePhone(phone)
      }

      if (userData.idUserType === 1) {
        drivingLicense !== validatedDrivingLicense
          ? await validateDrivingLicenseAndCity(drivingLicense, city)
          : validateCity(city)
      } else if (userData.idUserType === 2) {
        validateEmergencyPhone(emergencyPhone)
      }
    } catch (error) {
      setErrorMessage(error)
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('profile')
      .update({ name, phone })
      .eq('id', userData.id)
      .select()
    const { error: errorDriver } = await supabase
      .from('driver')
      .update({ drivinglicense: drivingLicense, city })
      .eq('id', userData.id)
      .select()
    const { error: errorPassenger } = await supabase
      .from('passenger')
      .update({ emergencyphone: emergencyPhone })
      .eq('id', userData.id)
      .select()
    const { error: errorMail } = await supabase.auth.updateUser({ email })

    setUpdated(true)
    setLoading(false)
    setSave(false)
  }

  const moveToChangePassword = () => {
    navigation.navigate('ChangePassword')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ModalSuccessfulProfileUpdate visible={updated} onPress={() => setUpdated(false)} />
      <View style={styles.avatarSection}>
        <Thumbnail
          name={userData?.name}
          url={userData?.idImage}
        />
      </View>
      <ScrollView style={styles.detailsSection}>
        <InputStyled
          leftIcon={<Icon name='person' size={30} />}
          value={name}
          onChangeText={(text) => {
            setName(text)
            setSave(true)
          }}
          errorMessage={errorMessage}
          name='name'
          placeholder='Nombre'
          inputMode='text'
        />
        <InputStyled
          leftIcon={<Icon name='mail' size={30} />}
          value={email}
          onChangeText={(email) => {
            if (email !== userData.email) {
              setEmail(email)
              setSave(true)
            } else {
              setEmail(userData.email)
              setSave(true)
            }
          }}
          errorMessage={errorMessage}
          name='email'
          placeholder='Correo electrónico'
          inputMode='text'
        />
        <InputStyled
          leftIcon={<Icon name='phone' size={30} />}
          value={phone}
          onChangeText={(text) => {
            setPhone(text)
            setSave(true)
          }}
          errorMessage={errorMessage}
          name='phone'
          placeholder='Telefono'
          inputMode='tel'
        />
        {userData.idUserType === 2
          ? (
            <InputStyled
              leftIcon={<Icon name='phone' size={30} />}
              value={emergencyPhone}
              onChangeText={(text) => {
                setEmergencyPhone(text)
                setSave(true)
              }}
              errorMessage={errorMessage}
              name='emergencyPhone'
              placeholder='Teléfono de emergencia'
              inputMode='tel'
            />
            )
          : (
            <View>
              <InputStyled
                leftIcon={<Icon name='info' size={30} />}
                value={drivingLicense}
                onChangeText={(text) => {
                  setDrivingLicense(text)
                  setSave(true)
                }}
                errorMessage={errorMessage}
                name='drivingLicense'
                placeholder='Número de licencia de conducir'
                inputMode='text'
              />
              <InputStyled
                leftIcon={<Icon name='place' size={30} />}
                value={city}
                onChangeText={(text) => {
                  setCity(text)
                  setSave(true)
                }}
                name='city'
                placeholder='Ciudad'
                inputMode='text'
                errorMessage={errorMessage}
              />
            </View>
            )}
        <InputStyled
          leftIcon={<Icon name='lock' size={30} />}
          title='Contraseña'
          value={userData.name}
          secureTextEntry
          onPressIn={moveToChangePassword}
        />
        {save
          ? (
            <Button
              buttonStyle={styles.button}
              color='#8946A6'
              title='Guardar cambios'
              onPress={updateData}
              loading={loading}
            />
            )
          : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B762C1',
    marginBottom: 20,
    height: '20%'
  },
  detailsSection: {
    flex: 1,
    backgroundColor: 'white'
  },
  button: {
    marginTop: 5,
    color: '#8946A6',
    width: 330,
    height: 50,
    alignSelf: 'center',
    borderRadius: 10
  }
})
