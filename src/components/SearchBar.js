import React, { useContext, useEffect, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { getSearchLocation } from "../services/getSearchLocation";

export function SearchBar({ currentLocation, onSearch = () => {} }) {

  handleSearch = (search) => {
     const place_id = search.place_id;
    getSearchLocation(place_id).then((placeDetail) => {
      const location = placeDetail.result.geometry.location;
      location.name = placeDetail.result.name
      onSearch(location)
  })
}
  
  return (
    <>
      <GooglePlacesAutocomplete
        placeholder="Buscar"
        onPress={(search) => {
          handleSearch(search);
        }}
        query={{
          key: "AIzaSyBNLEE0e6JiPHJh88NuSvdOLBggmS43Mv0",
          language: "es",
          components: "country:mx",
          radius: 5000,
          location: `${currentLocation.coords.latitude}, ${currentLocation.coords.longitude}`,
          strictbounds: true,
        }}
        styles={{
          container: {
            position: "absolute",
            top: Platform.select({ ios: "12%", android: "12%" }),
            width: "100%",
          },
        }}
      />
    </>
  );
}
