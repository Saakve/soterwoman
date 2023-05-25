import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SearchBar } from "./SearchBar";
import { useState, useEffect, useContext } from "react";
import MapViewDirections from "react-native-maps-directions";
import WonderSelector from "../pages/WonderSelector";
import PayChildrenSelector from "../pages/PayChildrenSelector";
import WaitSelector from "../pages/WaitSelector";
import { ManageTripPassenger } from "./ManageTripPassenger";
import { supabase } from "../services/supabase";
import { makeChannel } from "../services/makeChannel";
import UserContext from "../context/UserContext";

export function PassengerMapContainer({currentLocation}) {
  const [searchLocation, setSearchLocation] = useState(null)
  const [showWonderSelector, setShowWonderSelector] = useState(false)
  const [showPaySelector, setShowPaySelector] = useState(false);
  const [showWaitSelector, seShowWaitSelector] = useState(false);
  const [showManageTrip, setShowManageTrip] = useState(false);
  const [channel, setChannel] = useState(null);
  const { userData, dataIsLoaded } = useContext(UserContext);

    useEffect(() => {
      const channel = makeChannel({
        channelName: "trips",
        eventType: "broadcast",
        filter: { event: "accept" },
        callback: (response) => console.log(response),
      });
      setChannel(channel);
      console.log("LISTENING");

      return () => supabase.removeChannel(channel);
    }, [supabase]);

  const handleSearch = (searchLocation) => {
    setSearchLocation(searchLocation) 
    setShowWonderSelector(true)
  }

  
  const handleSelectWonder = () => {
    setShowWonderSelector(false)
    setShowPaySelector(true)
  }

  const handleConfirmTrip = () => {
     const sendRequest = async () => {
       await channel.send({
         type: "broadcast",
         event: "request",
         payload: `Hola soy ${userData.name}`,
       });
     };
     sendRequest()
     setShowPaySelector(false)
     seShowWaitSelector(true)
  }

  const handleCancel = () => {
    seShowWaitSelector(false);
    setShowManageTrip(true);
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
          title={"Marcador"}
          pinColor={"purple"}
        />
        {searchLocation && (
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
        )}
      </MapView>
      <SearchBar currentLocation={currentLocation} onSearch={handleSearch} />
      {showWonderSelector && (
        <WonderSelector
          origin={currentLocation.name}
          destination={searchLocation.name}
          onSelectWonder={handleSelectWonder}
        />
      )}
      {showPaySelector && (
        <PayChildrenSelector
          origin={currentLocation.name}
          destination={searchLocation.name}
          onPress={handleConfirmTrip}
        />
      )}
      {showWaitSelector && <WaitSelector onPress={handleCancel} />}
      {showManageTrip && (
        <ManageTripPassenger
          onPress={handleCancel}
          origin={currentLocation.name}
          destination={searchLocation.name}
        />
      )}
    </View>
  );
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
