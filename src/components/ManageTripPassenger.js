import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Call from 'react-native-phone-call'
import { Button, Icon } from '@rneui/base'

import Avatar from './Avatar'

import { TripPoints } from './TripPoints'

export function ManageTripPassenger ({
  driver,
  origin,
  destination,
  onCancelledTrip = () => {}
}) {
  const navigation = useNavigation()

  const triggerCall = () => {
    const args = {
      number: driver.phone,
      prompt: true
    }

    Call(args).catch(console.error)
  }

  const displayMessage = () => {
    navigation.navigate('Message', {
      toUser: driver
    })
  }

  return (
    <View style={styles.selector}>
      <View style={styles.header}>
        <Avatar
          url={driver?.idimage}
          editable={false}
          size={50}
          style={styles.avatar}
        />
        <View style={styles.userdata}>
          <Text style={styles.text}>{driver?.name}</Text>
          <View style={styles.ratinguser}>
            <Icon name='star' type='font-awesome' color='#FFCC00' />
            <Text style={styles.rating}>{driver?.rating}</Text>
          </View>
        </View>
        <View style={styles.tripdata}>
          <Icon
            name='comment-dots'
            type='font-awesome-5'
            solid
            color='#4252FF'
            size={35}
            onPressOut={displayMessage}
          />
          <Icon
            name='phone'
            type='font-awesome'
            color='#4CE5B1'
            size={35}
            onPressOut={triggerCall}
          />
        </View>
      </View>
      <TripPoints nameStartingpoint={origin} nameEndpoint={destination} />
      <View style={styles.buttons}>
        <Button
          title='Cancelar Viaje'
          buttonStyle={styles.button}
          color='#B10710'
          onPressOut={onCancelledTrip}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  selector: {
    width: '100%',
    height: '25%',
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#FFF'
  },
  header: {
    height: '35%',
    backgroundColor: '#F7F7F7',
    flexDirection: 'row',
    paddingHorizontal: '2%',
    alignItems: 'center'
  },
  avatar: {
    marginTop: 0
  },
  userdata: {
    marginHorizontal: '5%',
    justifyContent: 'center'
  },
  ratinguser: {
    flexDirection: 'row'
  },
  rating: {
    color: '#C8C7CC',
    paddingLeft: '2%'
  },
  tripdata: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  servicetype: {
    marginRight: '5%',
    alignItems: 'center'
  },
  children: {
    marginLeft: '5%',
    alignItems: 'center'
  },
  trippoints: {
    flexDirection: 'row',
    height: '30%',
    marginBottom: '2%'
  },
  icons: {
    marginHorizontal: '5%',
    justifyContent: 'space-evenly'
  },
  nametrippoints: {
    justifyContent: 'space-evenly'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    borderRadius: 10,
    width: 163,
    height: 50
  },
  text: {
    color: '#111'
  }
})
