import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qpjoefksrhnybmzcybnk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwam9lZmtzcmhueWJtemN5Ym5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA5MzYzODEsImV4cCI6MTk5NjUxMjM4MX0._zV6pl8NEmWn-FS8eXhjkzZpwNv7ITt8kBOB7pRR5RQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage
    }
})