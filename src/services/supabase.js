import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://roigpocvdrlwmcksgdgq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvaWdwb2N2ZHJsd21ja3NnZGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE2ODQzNzMsImV4cCI6MTk5NzI2MDM3M30.AWuMHs8S_0XfODWQnr6uzqHxjnKqSjOTR23LsVhmmsQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage
  }
})
