import { useContext, useEffect, useState, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import MapViewDirections from 'react-native-maps-directions'

import UserContext from '../context/UserContext'
import SignInLikeContext from '../context/SingInLikeContext'

import { ModalReport } from '../components/ModalReport'
import { MapContainer } from '../components/MapContainer'
import { ToggleOnService } from '../components/ToggleOnService'
import { ManageTrip } from '../components/ManageTrip'
import { TripSelector } from '../components/TripSelector'

import { supabase } from '../services/supabase'
import { getNearbyTrips } from '../services/getNearbyTrips'

import useCurrentLocation from '../hooks/useCurrentLocation'
import useCurrentLocationUpdateListener from '../hooks/useListenCurrentLocationUpdates'

import tripStatus from '../utils/tripStatus'
import { TripMarkers } from '../components/TripMarkers'
import { Marker } from 'react-native-maps'
import { distanceBetweenCoords } from '../utils/distanceBetweenCoords'
import { ModalWaitingPassenger } from '../components/ModalWaitingPassenger'

function HomeDriver({ navigation }) {
  const { userData, dataIsLoaded } = useContext(UserContext)
  const { signInLike } = useContext(SignInLikeContext)

  const { location, loaded } = useCurrentLocation()
  const locationListener = useCurrentLocationUpdateListener()

  const [trips, setTrips] = useState([])
  const [tripSelected, setTripSelected] = useState(null)
  const [showSelector, setShowSelector] = useState(false)
  const [showManageTrip, setShowManageTrip] = useState(false)
  const [timeToOrigin, setTimeToOrigin] = useState(0)
  const [distanceToOrigin, setDistanceToOrigin] = useState(0)
  const [currentLocation, setCurrentLocation] = useState({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  })
  const [arrivedToOrigin, setArrivedToOrigin] = useState(false)
  const [showWaitingModal, setShowWaitingModal] = useState(false)

  const channel = useRef(null)

  useEffect(() => {
    if (dataIsLoaded && !userData.idUserType) {
      if (signInLike === 'passenger') navigation.navigate('CompletePassengerProfile')
      if (signInLike === 'driver') navigation.navigate('CompleteDriverProfile')
    }
  }, [dataIsLoaded])

  useEffect(() => {
    if(tripSelected && showManageTrip && !arrivedToOrigin ) {
      const distance = distanceBetweenCoords(tripSelected.startingpoint, currentLocation)
      console.log(distance)
      if(distance <= 20) setArrivedToOrigin(true)
    }
  }, [currentLocation])

  const handleArriveTrip = (trip) => {
    console.log('MANAGE:', trip)
    setShowWaitingModal(true)
  }

  const fetchTrips = async () => {
    const trips = await getNearbyTrips({
      idUser: userData.id,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      range: 5000
    })

    setTrips(trips)
  }

  const listenTripChanges = () => {
    const newChannel = supabase
      .channel('trips')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trip' }, fetchTrips)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trip' }, fetchTrips)
      .subscribe()

    channel.current = newChannel
  }

  const sendCurrentLocation = () => {
    locationListener.subscribe(({ coords }) => {
      setCurrentLocation({
        latitude:coords.latitude,
        longitude: coords.longitude
      })

      channel.current.send({
        type: 'broadcast',
        event: userData.id,
        payload: {
          longitude: coords.latitude,
          longitude: coords.longitude,
        }
      })
    })
  }

  const stopSendingCurrentLocation = () => {
    locationListener.remove()
  }

  const handleToggle = (onService) => {
    if (onService && loaded) {
      fetchTrips() // fetch initial trips
      listenTripChanges()
      sendCurrentLocation()
    } else if (!onService) {
      setShowSelector(false)
      setTripSelected(false)
      stopSendingCurrentLocation()
      if (channel.current) supabase.removeChannel(channel.current)
      setTrips([])
    }
  }

  const handleMarkerPress = async (id) => {
    if (tripSelected) {
      await handleCancelledTrip(tripSelected)
    }

    const [trip] = trips.filter(trip => trip.id === id)
    setTripSelected(trip)
    setShowSelector(true)
  }

  const handleCancelledTrip = async (trip) => {
    if (showManageTrip) setShowManageTrip(false)
    if (showSelector) setShowSelector(false)
    if (tripSelected) setTripSelected(null)

    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.DRAFT,
      iddriver: null
    }).eq('id', trip.id)
    if (error) console.log('handleCancelledTrip', error)
  }

  const handleConfirmedTrip = async (trip) => {
    setShowSelector(false)
    setShowManageTrip(true)
    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.CONFIRMED,
      iddriver: userData.id
    }).eq('id', trip.id)
    if (error) console.log('handleConfirmedTrip', error)
  }

  const selectTripOnDB = async (trip) => {
    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.PENDING,
      iddriver: userData.id
    }).eq('id', trip.id)
    if (error) console.log('selectTripOnDB ', error)
  }

  return (
    <View style={styles.container}>
      <MapContainer
        currentLocation={location}
      >
        {
          !!trips.length &&
          <TripMarkers
            trips={trips}
            onPress={handleMarkerPress}
          />
        }
        {
          tripSelected &&
          <MapViewDirections
            origin={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            destination={{
              latitude: tripSelected.startingpoint.latitude,
              longitude: tripSelected.startingpoint.longitude,
            }}
            apikey={"AIzaSyBNLEE0e6JiPHJh88NuSvdOLBggmS43Mv0"}
            strokeWidth={6}
            strokeColor="#FDCD03"
            onReady={({ distance, duration }) => {
              setDistanceToOrigin(distance)
              setTimeToOrigin(duration)
            }}
          />
        }
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          }}
          title='Yo'
          pinColor='#8946A6'
        />
      </MapContainer>
      <ToggleOnService onToggle={handleToggle} />
      {
        showSelector &&
        <TripSelector
          trip={tripSelected}
          onCancelledTrip={handleCancelledTrip}
          onConfirmedTrip={handleConfirmedTrip}
          onSelectedTrip={selectTripOnDB}
          timeToOrigin={timeToOrigin}
          distanceToOrigin={distanceToOrigin}
        />
      }
      {
        showManageTrip &&
        <ManageTrip
          trip={tripSelected}
          onCancelledTrip={handleCancelledTrip}
          onArriveOriginTrip={handleArriveTrip}
          arrived={arrivedToOrigin}
        />
      }
      <ModalReport
        visible={false}
        userToReport='afcfc3f6-4854-4976-88e8-57a8480fdd09'
      />
      <ModalWaitingPassenger
        visible={showWaitingModal}
        onPress={() => console.log("PETE")}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export { HomeDriver }