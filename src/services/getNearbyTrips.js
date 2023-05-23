import tripStatus from "../utils/tripStatus"
import { supabase } from "./supabase"

export async function getNearbyTrips({idUser,latitude, longitude, range}) {
  const { data } = await supabase.rpc('getNearbyTrips', {
    lat: latitude,
    long: longitude,
    range: range
  })

  const filteredData = data.filter(trip => (trip.iddriver === idUser || trip.idstatus < tripStatus.PENDING))

  const trips = filteredData.map(({
    id,
    children,
    cost,
    endpoint,
    startingpoint,
    idpassenger,
    idstatus,
    name_endpoint,
    name_startingpoint,
    idservicetype,
    idpaymentmethodtype
  }) => {

    const [spLongitude, spLatitude] = startingpoint.split(' ')
    const [epLongitude, epLatitude] = endpoint.split(' ')

    return ({
      id,
      children,
      cost,
      endpoint: { longitude: Number(epLongitude), latitude: Number(epLatitude) },
      startingpoint: { longitude: Number(spLongitude), latitude: Number(spLatitude) },
      idPassenger: idpassenger,
      idStatus: idstatus,
      nameEndpoint: name_endpoint,
      nameStartingpoint: name_startingpoint,
      idServicetype: idservicetype,
      idPaymentmethodType: idpaymentmethodtype
    })
  })

  return trips
}