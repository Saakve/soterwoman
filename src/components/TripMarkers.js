import { Marker } from 'react-native-maps'

export function TripMarkers ({ trips, onPress }) {
  return trips.map(({ id, startingpoint: { latitude, longitude } }) => <Marker
    key={id}
    draggable={false}
    coordinate={{
      latitude,
      longitude
    }}
    title='TripRequest'
    pinColor='red'
    onPress={() => onPress(id)}
                                                                       />)
}
