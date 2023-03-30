import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uwytupaxxiraydpnyhdl.supabase.co/"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eXR1cGF4eGlyYXlkcG55aGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg0NTM0MTIsImV4cCI6MTk5NDAyOTQxMn0.F1HExeNnNliggwDssAjoLp-eMJvwsvbDXd5wcFv8Zw4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage
    }
})