import { useRef } from 'react'
import * as Location from 'expo-location'

export default function useCurrentLocationUpdateListener() {
  const locationSubscription = useRef(null)

  const subscribe = async (callback) => {
    if (locationSubscription.current) return

    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status === 'granted') {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation
        },
        callback
      )

      locationSubscription.current = subscription
    }
  }

  const remove = () => {
    if(!locationSubscription.current) return
    locationSubscription.current.remove()
    locationSubscription.current = null
  }

  return { subscribe, remove }
}
