import { StyleSheet, Text, View } from 'react-native'
import { Icon } from '@rneui/base'

import Avatar from './Avatar'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export function ToEndpointPassenger ({ driver }) {
  const [vehicle, setVehicle] = useState(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      const { data: [vehicle], error } = await supabase.rpc('getVehicleFromIdDriver', {
        iddriver: driver.id
      })

      if (error) console.log('fetchVehicle', error)

      setVehicle(vehicle)
    }
    fetchVehicle()
  }, [])

  return (
    <View style={styles.selector}>
      <View style={styles.avatarcontainer}>
        <Avatar
          url={driver?.idimage}
          editable={false}
          size={60}
          style={styles.avatar}
        />
      </View>
      <View style={styles.driverinfo}>
        <View style={styles.userdata}>
          <Text style={styles.text}>{driver?.name}</Text>
          <View style={styles.ratinguser}>
            <Icon name='star' type='font-awesome' color='#FFCC00' />
            <Text style={styles.rating}>{driver?.rating}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.licenseplate}>{vehicle?.licenseplate}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Text style={styles.vehicletext}>{vehicle?.brand}</Text>
            <Text style={styles.vehicletext}>{vehicle?.year}</Text>
            <Text style={styles.vehicletext}>{vehicle?.model}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  selector: {
    width: '100%',
    height: '20%',
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#FFF'
  },
  avatarcontainer: {
    top: -20,
    backgroundColor: '#FFF',
    marginLeft: '10%',
    height: 75,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  },
  avatar: {
    marginTop: 0
  },
  ratinguser: {
    flexDirection: 'row'
  },
  rating: {
    color: '#C8C7CC',
    paddingLeft: '2%'
  },
  driverinfo: {
    top: -10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  text: {
    color: '#111',
    fontFamily: 'OpenSans-Bold',
    fontSize: 16
  },
  licenseplate: {
    color: '#3E4958',
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    backgroundColor: '#D5DEE2',
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  vehicletext: {
    marginHorizontal: '1%',
    fontFamily: 'OpenSans-Regular',
    color: '#3E4958',
    fontSize: 16
  }
})
