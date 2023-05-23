import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uwemubqpliswtrslaqmd.supabase.co'
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZW11YnFwbGlzd3Ryc2xhcW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3OTgzMjMsImV4cCI6MjAwMDM3NDMyM30.7WB7mF8EVm1DF7ftpLBRyBPb1YS0hlcpmYXyHFlRw8c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage
  }
})
