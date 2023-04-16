import { useState, useEffect } from "react"
import * as Location from 'expo-location'

export default function useCurrentLocation() {
  const [location, setLocation] = useState({
    coords: {
      latitude: 20,
      longitude: 20,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getCurrenLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if (status === 'granted') console.log('Permiso concedido')
      else console.log('Permisos no concedidos')

      const loc = await Location.getCurrentPositionAsync()

      const codeFormatAdress = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })

      loc.name = codeFormatAdress[0].name
      setLocation(loc)
      setLoading(true)
    }

    getCurrenLocation()

  }, [])

  return {location, loading}
};