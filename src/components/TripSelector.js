import { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { Button, Icon } from "@rneui/base"

import Avatar from "./Avatar"

import serviceType from "../utils/serviceType"
import paymentMethodType from "../utils/paymentMethodType"

export function TripSelector({ trip, passenger, distanceToOrigin, timeToOrigin, onCancelledTrip = () => { }, onConfirmedTrip = () => { } }) {
  const [counter, setCounter] = useState(30)
  const interval = useRef(null)

  useEffect(() => {
    if (counter === 0) {
      clearInterval(interval.current)
      onCancelledTrip(trip)
    }
  }, [counter])

  useEffect(() => {
    interval.current = setInterval(() => {
      setCounter(counter => --counter)
    }, 1000)

    return () => { clearInterval(interval.current) }
  }, [])

  return (
    <View style={styles.selector}>
      <View style={styles.header}>
        <Avatar
          url={passenger?.idimage}
          editable={false}
          size={50}
          style={styles.avatar}
        />
        <View style={styles.userdata}>
          <Text style={styles.text}>{passenger?.name}</Text>
          <View style={styles.ratinguser}>
            <Icon
              name='star'
              type='font-awesome'
              color='#FFCC00'
            />
            <Text style={styles.rating}>{passenger?.rating}</Text>
          </View>
        </View>
        <View style={styles.tripdata}>
          <View style={styles.servicetype}>
            <Icon
              name='car-side'
              type='font-awesome-5'
              color='#242E42'
            />
            <Text style={styles.text}>Wonder {trip.idServicetype === serviceType.CLASSIC ? 'Clásico' : 'Emergencia'} </Text>
          </View>
          <View style={styles.children}>
            <Icon
              name='child'
              type='font-awesome'
              color='#F0C59D'
            />
            <Text style={styles.text}>{trip.children}</Text>
          </View>
        </View>
      </View>
      <View style={styles.trippoints}>
        <View style={styles.icons}>
          <Icon
            name='dot-circle'
            type='font-awesome-5'
            color='#4CE5B1'
          />
          <Icon
            name='map-marker-alt'
            type='font-awesome-5'
            color='#F52D56'
          />
        </View>
        <View style={styles.nametrippoints}>
          <Text style={styles.text}>{trip.nameStartingpoint}</Text>
          <Text style={styles.text}>{trip.nameEndpoint}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.time}>
          <Text style={styles.timetext}>{counter}</Text>
        </View>
        <Text style={styles.text}>MÉTODO {'\n'}{trip.idPaymentmethodType === paymentMethodType.CARD ? 'Tarjeta' : 'Efectivo'}</Text>
        <Text style={styles.text}>DISTANCIA {'\n'}{distanceToOrigin.toFixed(3)} Km</Text>
        <Text style={styles.text}>TIEMPO {'\n'}{Math.ceil(timeToOrigin)} min</Text>
        <Text style={styles.text}>PRECIO {'\n'}{trip.cost}</Text>
      </View>
      <View style={styles.buttons}>
        <Button
          title={'Cancelar'}
          buttonStyle={styles.button}
          color="#B10710"
          onPressOut={() => onCancelledTrip(trip)}
        />
        <Button
          title={'Aceptar'}
          buttonStyle={styles.button}
          color="#4CE5B1"
          onPressOut={() => onConfirmedTrip(trip)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  selector: {
    width: "100%",
    height: "35%",
    bottom: 0,
    position: "absolute",
    backgroundColor: "#FFF",
  },
  header: {
    height: "25%",
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    paddingHorizontal: "2%",
    alignItems: "center",
  },
  avatar: {
    marginTop: 0
  },
  userdata: {
    marginHorizontal: "5%",
    justifyContent: "center",
  },
  ratinguser: {
    flexDirection: "row",
  },
  rating: {
    color: "#C8C7CC",
    paddingLeft: "2%"
  },
  tripdata: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  servicetype: {
    marginRight: "5%",
    alignItems: "center"
  },
  children: {
    marginLeft: "5%",
    alignItems: "center"
  },
  trippoints: {
    flexDirection: "row",
    height: "30%"
  },
  icons: {
    marginHorizontal: "5%",
    justifyContent: "space-evenly"
  },
  nametrippoints: {
    justifyContent: "space-evenly"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    borderRadius: 10,
    width: 163,
    height: 50,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: "3%"
  },
  time: {
    backgroundColor: "#FFCDDD",
    width: "10%",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "#111",
  }
})