import { useContext, useEffect, useState } from 'react'
import { View, Text, Alert, StyleSheet } from 'react-native'
import { Button } from '@rneui/base'

import { useSignInWithProvider } from '../hooks/useSignInWithProvider'
import { useSignInWithEmail } from '../hooks/useSignInWithEmail'

import { InputStyled } from '../components/InputStyled'
import { validateFormatEmailAndPassword } from '../utils/validateInputs'
import SignInLikeContext from '../context/SingInLikeContext'

export function SignIn ({ route }) {
  const { setSignInLike } = useContext(SignInLikeContext)
  const { userType } = route.params

  const { isLoading: isLoadingFacebook, error: errorFacebook, signIn: signInWithFacebook } = useSignInWithProvider({ provider: 'facebook' })
  const { isLoading: isLoadingGoogle, error: errorGoogle, signIn: signInWithGoogle } = useSignInWithProvider({ provider: 'google' })
  const { isLoading: isLoadingEmail, error: errorEmail, signIn } = useSignInWithEmail()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const anyerror = errorFacebook || errorGoogle || errorEmail
    if (anyerror) Alert.alert('Error', anyerror.message)
  }, [errorFacebook, errorGoogle, errorEmail])

  const handlePressButton = async () => {
    setErrorMessage(null)
    try {
      validateFormatEmailAndPassword(email, password)
    } catch (error) {
      console.log(error)
      setErrorMessage(error)
      return
    }
    setSignInLike(userType)
    await signIn({ email, password })
  }

  const handleGooglePressButton = async () => {
    setSignInLike(userType)
    await signInWithGoogle()
  }

  const handleFacebookPressButton = async () => {
    setSignInLike(userType)
    await signInWithFacebook()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Iniciar sesión</Text>
      </View>
      <InputStyled
        name='email'
        placeholder='Correo electrónico'
        value={email}
        onChangeText={text => setEmail(text.trim())}
        errorMessage={errorMessage}
        inputMode='email'
      />
      <InputStyled
        name='password'
        placeholder='Contraseña'
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text.trimStart())}
        errorMessage={errorMessage}
        inputMode='text'
      />
      <Button
        title='Iniciar sesión'
        disabled={isLoadingEmail}
        onPress={handlePressButton}
        color='#8946A6'
        buttonStyle={styles.button}
      />
      <View style={styles.providers}>
        <Button
          color='#fff'
          icon={{
            color: 'blue',
            type: 'font-awesome',
            name: 'facebook'
          }}
          onPress={handleFacebookPressButton}
          disabled={isLoadingFacebook || isLoadingGoogle}
        />
        <Button
          icon={{
            type: 'font-awesome',
            name: 'google'
          }}
          onPress={handleGooglePressButton}
          disabled={isLoadingFacebook || isLoadingGoogle}
          color='#fff'
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center'
  },
  header: {
    alignSelf: 'center',
    width: 335
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'left',
    fontSize: 24,
    marginBottom: 13
  },
  providers: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    marginTop: 20,
    color: '#8946A6',
    width: 330,
    height: 50,
    alignSelf: 'center',
    borderRadius: 10
  }
})
