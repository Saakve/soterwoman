import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://poshzyeniwnnlxhqvbgn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvc2h6eWVuaXdubmx4aHF2YmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0MjM5ODcsImV4cCI6MTk5OTk5OTk4N30.QP_jmrBoQJEg1FLdFC6hqjKY6RrHW9NX-GT4XytPQng'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage
  }
})
