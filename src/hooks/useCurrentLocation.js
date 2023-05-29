import { useState, useEffect } from 'react'
import * as Location from 'expo-location'

export default function useCurrentLocation () {
  const [location, setLocation] = useState({
    coords: {
      latitude: 20,
      longitude: 20,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }
  })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const getCurrenLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status === 'granted') console.log('Permiso concedido')
      else console.log('Permisos no concedidos')

      const loc = await Location.getCurrentPositionAsync()
      const codeFormatAdress = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      })
      loc.name = codeFormatAdress[0].name
      loc.streetNumber = codeFormatAdress[0].streetNumber
      loc.street = codeFormatAdress[0].street
      setLocation(loc)
      setLoaded(true)
    }

    getCurrenLocation()
  }, [])

  return { location, loaded }
};
