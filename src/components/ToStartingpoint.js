import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Call from 'react-native-phone-call'
import { Button, Icon } from '@rneui/base'

import Avatar from './Avatar'

export function ToStartingpoint ({ trip, passenger, onCancelledTrip = () => { }, onArriveOriginTrip = () => { }, arrived = false }) {
  const navigation = useNavigation()

  const triggerCall = () => {
    const args = {
      number: passenger.phone,
      prompt: true
    }

    Call(args).catch(console.error)
  }

  const displayMessage = () => {
    navigation.navigate('Message', {
      toUser: passenger
    })
  }

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
      <View style={styles.buttons}>
        <Button
          title='Cancelar'
          buttonStyle={styles.button}
          color='#B10710'
          onPressOut={() => onCancelledTrip(trip)}
        />
        <Button
          title='¡Ya llegué!'
          buttonStyle={styles.button}
          color='#4CE5B1'
          onPressOut={() => {
            onArriveOriginTrip(trip)
          }}
          disabled={!arrived}
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
