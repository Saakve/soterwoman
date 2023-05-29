import { useState, useEffect } from 'react'
import { Platform } from 'react-native'

import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'

import { supabase } from '../services/supabase'

import getQueryParamsFromURL from '../utils/getQueryParamsFromURL'

export function useSignInWithProvider ({ provider }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSignInBrowser, setIsSignInBrowser] = useState(false)
  const URL = Linking.useURL()

  useEffect(() => {
    if (isSignInBrowser) setSession()
    if (Platform.OS === 'ios' && URL) WebBrowser.dismissBrowser()
  }, [URL, isSignInBrowser])

  const setSession = async () => {
    try {
      const { access_token, refresh_token } = getQueryParamsFromURL({ url: URL })
      await supabase.auth.setSession({ access_token, refresh_token })
    } catch (error) {
      console.log('Found error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithProvider = async () => {
    setIsLoading(true)
    const deepLinkOfTheApp = Linking.createURL('')

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: deepLinkOfTheApp
      }
    })

    setError(error)

    if (Platform.OS === 'android') await WebBrowser.openAuthSessionAsync(data.url)
    else if (Platform.OS === 'ios') await WebBrowser.openBrowserAsync(data.url)

    setIsSignInBrowser(true)
  }

  return { isLoading, error, signIn: signInWithProvider }
}
