import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ibxdcsxqmqhgfldoxkgh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlieGRjc3hxbXFoZ2ZsZG94a2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3NzY3MzQsImV4cCI6MjAwMDM1MjczNH0._CVQHuBB0lYSmCFUJ-N1fzaXPuLB0D7k44bra-ZheU4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage
  }
})
