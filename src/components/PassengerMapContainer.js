import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import WonderSelector from "../pages/WonderSelector";

export function PassengerMapContainer({currentLocation}) {
  const [searchLocation, setSearchLocation] = useState(null)

  const handleSearch = (searchLocation) => {
    setSearchLocation(searchLocation)       
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
      {searchLocation && (
        <WonderSelector
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
