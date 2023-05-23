import { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import { TripSelector } from './TripSelector'
import { ManageTrip } from './ManageTrip';

export function MapContainer({ currentLocation, trips, onCancelledTrip, onConfirmedTrip, onSelectedTrip }) {
  const [showSelector, setShowSelector] = useState(false)
  const [showManageTrip, setShowManageTrip] = useState(false)
  const [tripSelected, setTripSelected] = useState(null)

  const handleMarkerPress = async (id) => {
    if (tripSelected) {
      await handleCancelledTrip(tripSelected)
    }

    const [trip] = trips.filter(trip => trip.id === id)
    setTripSelected(trip)
    setShowSelector(true)
  }

  const handleCancelledTrip = async (trip) => {
    if (showSelector) setShowSelector(false)
    if (trip) setTripSelected(null)
    if (showManageTrip) setShowManageTrip(false)
    onCancelledTrip(trip)
  }

  const handleConfirmedTrip = async (trip) => {
    setShowSelector(false)
    onConfirmedTrip(trip)
    setShowManageTrip(true)
  }

  const handleSelectedTrip = async (trip) => {
    setShowSelector(true)
    onSelectedTrip(trip)
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        initialRegion={{
          latitude: 18,
          longitude: -94,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
        region={{
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
        mapType='standard'
      >
        {
          trips.length > 0
            ? trips.map(({ id, startingpoint: { latitude, longitude } }) => <Marker
              key={id}
              draggable={false}
              coordinate={{
                latitude,
                longitude
              }}
              title='TripRequest'
              pinColor='red'
              onPress={() => handleMarkerPress(id)}
            />)
            : null
        }
      </MapView>
      {
        showSelector &&
        <TripSelector
          trip={tripSelected}
          onCancelledTrip={handleCancelledTrip}
          onConfirmedTrip={handleConfirmedTrip}
          onSelectedTrip={handleSelectedTrip}
        />
      }
      {
        showManageTrip &&
        <ManageTrip
          trip={tripSelected}
          onCancelledTrip={handleCancelledTrip}
          onArriveOriginTrip={(trip) => console.log('MANAGE:', trip)}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
})