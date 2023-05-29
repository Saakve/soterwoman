import { useState, useContext, useRef } from "react"
import { StyleSheet, View, Dimensions, Alert } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { useNavigation } from "@react-navigation/native"

import { SearchBar } from "./SearchBar"
import { ManageTripPassenger } from "./ManageTripPassenger"
import { ModalRating } from './ModalRating'
import { ModalTip } from './ModalTip'
import { ToEndpointPassenger } from "./ToEndpointPassenger"

import WonderSelector from "../pages/WonderSelector"
import PayChildrenSelector from "../pages/PayChildrenSelector"
import WaitSelector from "../pages/WaitSelector"

import { supabase } from "../services/supabase"
import { calculateTripCost } from "../services/calculateTripCost"

import UserContext from "../context/UserContext"

import tripStatus from "../utils/tripStatus"
import paymentMethodType from "../utils/paymentMethodType"
import { ModalDriverArrived } from "./ModalDriverArrived"

export function PassengerMapContainer({ currentLocation }) {
  const { userData } = useContext(UserContext);
  const [searchLocation, setSearchLocation] = useState(null)
  const [showWonderSelector, setShowWonderSelector] = useState(false)
  const [showPaySelector, setShowPaySelector] = useState(false);
  const [showWaitSelector, seShowWaitSelector] = useState(false);
  const [showManageTrip, setShowManageTrip] = useState(false);
  const [wonders, setWonders] = useState(null)
  const [serviceSelected, setService] = useState(null)
  const [trip, setTrip] = useState(null)
  const [driver, setDriver] = useState(null)
  const [showModalDriverArrived, setShowModalDriverArrived] = useState(false)
  const [showToEndpoint, setShowToEndpoint] = useState(false)
  const [showModalRating, setShowModalRating] = useState(false)
  const [showModalTip, setShowModalTip] = useState(false)
  const [driverLocation, setDriverLocation] = useState(null)
  const [showSearchBar, setShowSearchBar] = useState(true)

  const tripChannel = useRef(null)
  const driverChannel = useRef(null)

  const navigation = useNavigation()

  const handleOnSelectEndpoint = async ({ distance }) => {
    const wonders = await calculateTripCost(distance)
    setWonders(wonders)
  }

  const handleSearch = (searchLocation) => {
    setSearchLocation(searchLocation)
    setShowWonderSelector(true)
  }

  const handleSelectWonder = (id) => {
    setShowSearchBar(false)
    setService(id)
    setShowWonderSelector(false)
    setShowPaySelector(true)
  }

  const handleConfirmTrip = async ({ childrenNumber, paymentMethodSelected }) => {

    if (paymentMethodSelected === paymentMethodType.CARD && !userData.idStripe) {
      Alert.alert('Advertencia', 'Debes agregar por lo menos una tarjeta')
      navigation.navigate('Cards')
      return
    }

    const { data: [trip], error } = await supabase.from('trip')
      .insert({
        name_startingpoint: currentLocation.street.concat(" #", currentLocation.streetNumber),
        name_endpoint: searchLocation.name,
        startingpoint: `POINT(${currentLocation.coords.longitude} ${currentLocation.coords.latitude})`,
        endpoint: `POINT(${searchLocation.lng} ${searchLocation.lat})`,
        children: childrenNumber,
        cost: wonders.find(({ id }) => id === serviceSelected).price,
        idpassenger: userData.id,
        idstatus: tripStatus.DRAFT,
        idservicetype: serviceSelected,
        idpaymentmethodtype: paymentMethodSelected
      })
      .select('id')

    if (error) {
      console.log(error)
      return
    }

    setTrip(trip.id)
    listenTripChanges(trip.id)
    setShowPaySelector(false)
    seShowWaitSelector(true)
  }

  const listenTripChanges = (trip) => {
    const newChannel = supabase
      .channel('trip')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trip', filter: `id=eq.${trip}` }, onTripChange)
      .subscribe()

    tripChannel.current = newChannel
  }

  const stopListeningTripChanges = () => {
    if (tripChannel.current) supabase.removeChannel(tripChannel.current)
    tripChannel.current = null
  }

  const handleCancel = async () => {
    stopListeningTripChanges()
    stopListeningDriverLocation()
    setDriver(null)
    setDriverLocation(null)
    setShowSearchBar(true)

    const { error } = await supabase.from('trip').update({
      idstatus: tripStatus.CANCELLED
    }).eq('id', trip)

    if (error) console.log("handleCancel", error)

    setTrip(null)
    seShowWaitSelector(false)
    setShowManageTrip(false)
    setSearchLocation(null)
  }

  const onTripChange = async ({ new: trip }) => {
    if (trip.idstatus === tripStatus.CONFIRMED) {
      const driver = await fetchDriver(trip.iddriver)
      setDriver(driver)
      seShowWaitSelector(false)
      setShowManageTrip(true)
      listenDriverLocation(driver)
    } else if (trip.idstatus === tripStatus.ARRIVED) {
      setShowModalDriverArrived(true)
    } else if (trip.idstatus === tripStatus.STARTED) {
      setShowModalDriverArrived(false)
      setShowManageTrip(false)
      setShowToEndpoint(true)
    } else if (trip.idstatus === tripStatus.COMPLETED) {
      setShowToEndpoint(false)
      setShowModalRating(true)
      stopListeningDriverLocation()
      setDriverLocation(null)
      setShowSearchBar(true)
    }
  }

  const fetchDriver = async (id) => {
    const { data: [driver] } = await supabase.from("profile").select("*").eq("id", id);
    return driver
  }

  const listenDriverLocation = (driver) => {
    const newChannel = supabase
      .channel('driver-location')
      .on('broadcast', { event: driver.id }, onDriverLocation)
      .subscribe()

    driverChannel.current = newChannel
  }

  const onDriverLocation = ({ payload: { latitude, longitude } }) => {
    setDriverLocation({ latitude, longitude })
  }

  const stopListeningDriverLocation = () => {
    if (driverChannel.current) supabase.removeChannel(driverChannel.current)
    driverChannel.current = null
  }

  const handleOnPressRating = (rating) => {
    setShowModalRating(false)
    setSearchLocation(null)
    setTrip(null)
    stopListeningTripChanges()

    if (rating >= 4) {
      setShowModalTip(true)
      return
    }

    setDriver(null)
  }

  const handleOnPressTip = () => {
    setShowModalTip(false)
    setDriver(null)
  }

  return (
    <View style={styles.container}>
      <ModalRating
        userToRate={driver?.id}
        visible={showModalRating}
        onPress={handleOnPressRating}
      />
      <ModalTip
        driverToSendTip={driver && driver}
        visible={showModalTip}
        onPress={handleOnPressTip}
      />
      <ModalDriverArrived
        visible={showModalDriverArrived}
        driver={driver}
      />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        initialRegion={{
          latitude: 18,
          longitude: -94,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={{
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType="standard"
      >
        <Marker
          draggable={true}
          coordinate={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          }}
          title={"Yo"}
          pinColor={"purple"}
        />
        {
          searchLocation && (
            <>
              <MapViewDirections
                origin={{
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                }}
                destination={{
                  latitude: searchLocation.lat,
                  longitude: searchLocation.lng,
                }}
                apikey={"AIzaSyBNLEE0e6JiPHJh88NuSvdOLBggmS43Mv0"}
                strokeWidth={3}
                strokeColor="pink"
                onReady={handleOnSelectEndpoint}
              />
              <Marker
                draggable={false}
                coordinate={{
                  latitude: searchLocation.lat,
                  longitude: searchLocation.lng,
                }}
                title={"Marcador"}
                pinColor={"hotpink"}
              />
            </>
          )
        }
        {
          driverLocation && (
            <Marker
              draggable={true}
              coordinate={{
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
              }}
              title={"Conductora"}
              pinColor={"purple"}
            />
          )
        }
      </MapView>
      {
        showSearchBar && (
          <SearchBar
            currentLocation={currentLocation}
            onSearch={handleSearch}
          />
        )
      }
      {
        showWonderSelector && (
          <WonderSelector
            wonders={wonders}
            origin={currentLocation.street.concat(" #", currentLocation.streetNumber)}
            destination={searchLocation.name}
            onSelectWonder={handleSelectWonder}
          />
        )
      }
      {
        showPaySelector && (
          <PayChildrenSelector
            origin={currentLocation.street.concat(" #", currentLocation.streetNumber)}
            destination={searchLocation.name}
            onPress={handleConfirmTrip}
          />
        )
      }
      {
        showWaitSelector && (
          <WaitSelector onPress={handleCancel} />
        )
      }
      {
        showManageTrip && (
          <ManageTripPassenger
            driver={driver}
            onCancelledTrip={handleCancel}
            origin={currentLocation.street.concat(" #", currentLocation.streetNumber)}
            destination={searchLocation.name}
          />
        )
      }
      {
        showToEndpoint && <ToEndpointPassenger
          driver={driver}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
