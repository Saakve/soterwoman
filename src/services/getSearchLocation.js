const apiKey = "AIzaSyBNLEE0e6JiPHJh88NuSvdOLBggmS43Mv0";

/*Retorna el nombre y localización en coordenadas de la ubicación que se busca
 */
export function getSearchLocation(placeId) {
  const apiURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,geometry/location&key=${apiKey}`;
  return fetch(apiURL).then((res) => res.json());
}
