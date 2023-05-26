import { useContext, useEffect, useState, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import MapViewDirections from 'react-native-maps-directions'
import { Marker } from 'react-native-maps'

import UserContext from '../context/UserContext'
import SignInLikeContext from '../context/SingInLikeContext'

import { ModalReport } from '../components/ModalReport'
import { MapContainer } from '../components/MapContainer'
import { ToggleOnService } from '../components/ToggleOnService'
import { ToStartingpoint } from '../components/ToStartingpoint'
import { TripSelector } from '../components/TripSelector'
import { TripMarkers } from '../components/TripMarkers'
import { ModalWaitingPassenger } from '../components/ModalWaitingPassenger'
import { ToEndpoint } from '../components/ToEndpoint'

import { supabase } from '../services/supabase'
import { getNearbyTrips } from '../services/getNearbyTrips'

import useCurrentLocation from '../hooks/useCurrentLocation'
import useCurrentLocationUpdateListener from '../hooks/useListenCurrentLocationUpdates'

import tripStatus from '../utils/tripStatus'
import { distanceBetweenCoords } from '../utils/distanceBetweenCoords'
import paymentMethodType from '../utils/paymentMethodType'

function HomeDriver({ navigation }) {
  const { userData, dataIsLoaded } = useContext(UserContext)
  const { signInLike } = useContext(SignInLikeContext)

  const { location, loaded } = useCurrentLocation()
  const locationListener = useCurrentLocationUpdateListener()

  const [trips, setTrips] = useState([])
  const [passenger, setPassenger] = useState(null)
  const [tripSelected, setTripSelected] = useState(null)
  const [showSelector, setShowSelector] = useState(false)
  const [timeToOrigin, setTimeToOrigin] = useState(0)
  const [distanceToOrigin, setDistanceToOrigin] = useState(0)
  const [currentLocation, setCurrentLocation] = useState({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  })
  const [arrivedToStartingpoint, setArrivedToStartingpoint] = useState(false)
  const [arrivedToEndpoint, setArrivedToEndpoint] = useState(true)
  const [showWaitingModal, setShowWaitingModal] = useState(false)
  const [showRouteToEndpoint, setShowRouteToEndpoint] = useState(false)
  const [showRouteToStartingpoint, setShowRouteToStartingpoint] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const tripsChannel = useRef(null)
  const locationChannel = useRef(null)

  useEffect(() => {
    if (dataIsLoaded && !userData.idUserType) {
      if (signInLike === 'passenger') navigation.navigate('CompletePassengerProfile')
      if (signInLike === 'driver') navigation.navigate('CompleteDriverProfile')
    }
  }, [dataIsLoaded])

  useEffect(() => {
    if (tripSelected && showRouteToStartingpoint && !arrivedToStartingpoint) {
      const distance = distanceBetweenCoords(tripSelected.startingpoint, currentLocation)
      console.log("ToStartingpoint: ", distance)
      if (distance <= 20) setArrivedToStartingpoint(true)
    }
  }, [currentLocation])

  useEffect(() => {
    if (tripSelected && showRouteToEndpoint && !arrivedToEndpoint) {
      const distance = distanceBetweenCoords(tripSelected.endpoint, currentLocation)
      console.log("ToEndpoint: ", distance)
      if (distance <= 20) setArrivedToEndpoint(true)
    }
  }, [currentLocation])

  const fetchTrips = async () => {
    const trips = await getNearbyTrips({
      idUser: userData.id,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      range: 5000
    })

    setTrips(trips)
  }

  const fetchPassenger = async (id) => {
    const { data: [passengerData] } = await supabase.from('profile').select('*').eq('id', id)
    return passengerData
  }

  const listenTripChanges = () => {
    const newChannel = supabase
      .channel('trips')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trip' }, fetchTrips)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trip' }, fetchTrips)
      .subscribe()

    tripsChannel.current = newChannel
  }

  const sendCurrentLocation = () => {
    const newlocationChannel = supabase.channel('driver-location').subscribe()
    locationChannel.current = newlocationChannel

    locationListener.subscribe(({ coords }) => {
      setCurrentLocation({
        latitude: coords.latitude,
        longitude: coords.longitude
      })

      locationChannel.current.send({
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

  const stopListeningTripChanges = () => {
    if (tripsChannel.current) supabase.removeChannel(tripsChannel.current)
    tripsChannel.current = null
  }

  const handleToggleService = (onService) => {
    if (onService && loaded) {
      fetchTrips() // fetch initial trips
      listenTripChanges()
      sendCurrentLocation()
    } else if (!onService) {
      setShowSelector(false)
      setTripSelected(false)
      stopSendingCurrentLocation()
      stopListeningTripChanges()
      setTrips([])
    }
  }

  const handleMarkerPress = async (id) => {
    if (tripSelected) {
      await handleCancelledTrip(tripSelected)
    }

    const [trip] = trips.filter(trip => trip.id === id)

    const passenger = await fetchPassenger(trip.idPassenger)

    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.PENDING,
      iddriver: userData.id
    }).eq('id', trip.id)

    if (error) console.log('handleMarkerPress', error)

    setPassenger(passenger)
    setTripSelected(trip)
    setShowSelector(true)
    setShowRouteToStartingpoint(true)
  }

  const handleCancelledTrip = async (trip) => {
    if (showRouteToStartingpoint) setShowRouteToStartingpoint(false)
    if (showSelector) setShowSelector(false)
    if (tripSelected) setTripSelected(null)
    if (passenger) setPassenger(null)

    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.DRAFT,
      iddriver: null
    }).eq('id', trip.id)
    if (error) console.log('handleCancelledTrip', error)
  }

  const handleConfirmedTrip = async (trip) => {
    setShowSelector(false)
    setShowRouteToStartingpoint(true)
    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.CONFIRMED,
      iddriver: userData.id
    }).eq('id', trip.id)
    if (error) console.log('handleConfirmedTrip', error)
  }

  const startTrip = async () => {
    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.STARTED
    }).eq('id', tripSelected.id)
    if (error) console.log('startTrip', error)
    setShowWaitingModal(false)
    stopListeningTripChanges()
    setShowRouteToStartingpoint(false)
    setTrips([])
    setShowRouteToEndpoint(true)
  }

  const handleArriveStartingpoint = async (trip) => {
    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.ARRIVED
    }).eq('id', trip.id)
    if (error) console.log('handleArriveStartingpoint', error)
    setShowWaitingModal(true)
  }

  const handleArriveEndpoint = async () => {
    setShowRouteToEndpoint(false)

    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.COMPLETED
    }).eq('id', tripSelected.id)

    if (error) console.log('handleArriveEndpoint', error)

    if (tripSelected.idPaymentmethodType === paymentMethodType.CASH) {
      const { error } = await supabase.rpc('increaseDebt', {
        for_trip: tripSelected.id
      })

      if (error) console.log('SUPA_UPDATE_PROFILE:', error)
    }

    setTripSelected(null)
    fetchTrips()
    listenTripChanges()
  }

  const displayReport = () => {
    setShowReport(true)
  }

  const handleConfirmReport = async () => {
    setShowReport(false)
    setShowRouteToEndpoint(false)
    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.CANCELLED
    }).eq('id', tripSelected.id)
    if (error) console.log('handleReport', error)
    setTripSelected(null)
    fetchTrips()
    listenTripChanges()
  }

  const handleCancelReport = () => {
    setShowReport(false)
  }

  return (
    <View style={styles.container}>
      <ModalReport
        visible={showReport}
        userToReport={tripSelected?.idPassenger}
        onConfirm={handleConfirmReport}
        onCancel={handleCancelReport}
      />
      <ModalWaitingPassenger
        visible={showWaitingModal}
        onPress={startTrip}
      />
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
          showRouteToStartingpoint && tripSelected &&
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
        {
          showRouteToEndpoint && tripSelected &&
          <>
            <MapViewDirections
              origin={{
                latitude: tripSelected.startingpoint.latitude,
                longitude: tripSelected.startingpoint.longitude
              }}
              destination={{
                latitude: tripSelected.endpoint.latitude,
                longitude: tripSelected.endpoint.longitude
              }}
              apikey={"AIzaSyBNLEE0e6JiPHJh88NuSvdOLBggmS43Mv0"}
              strokeWidth={6}
              strokeColor="#B762C1"
            />
            <Marker
              coordinate={{
                latitude: tripSelected.startingpoint.latitude,
                longitude: tripSelected.startingpoint.longitude
              }}
              title='Inicio'
              pinColor='#8946A6'
            />
            <Marker
              coordinate={{
                latitude: tripSelected.endpoint.latitude,
                longitude: tripSelected.endpoint.longitude
              }}
              title='Final'
              pinColor='#8946A6'
            />
          </>
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
      <ToggleOnService onToggle={handleToggleService} />
      {
        showSelector &&
        <TripSelector
          trip={tripSelected}
          passenger={passenger}
          onCancelledTrip={handleCancelledTrip}
          onConfirmedTrip={handleConfirmedTrip}
          timeToOrigin={timeToOrigin}
          distanceToOrigin={distanceToOrigin}
        />
      }
      {
        !showSelector && showRouteToStartingpoint &&
        <ToStartingpoint
          trip={tripSelected}
          passenger={passenger}
          onCancelledTrip={handleCancelledTrip}
          onArriveOriginTrip={handleArriveStartingpoint}
          arrived={arrivedToStartingpoint}
        />
      }
      {
        showRouteToEndpoint &&
        <ToEndpoint
          passenger={passenger}
          trip={tripSelected}
          arrived={arrivedToEndpoint}
          onArriveEndpoint={handleArriveEndpoint}
          onReport={displayReport}
        />
      }
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