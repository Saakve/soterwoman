import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qpjoefksrhnybmzcybnk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwam9lZmtzcmhueWJtemN5Ym5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA5MzYzODEsImV4cCI6MTk5NjUxMjM4MX0._zV6pl8NEmWn-FS8eXhjkzZpwNv7ITt8kBOB7pRR5RQ"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

//SIGN UP
////PASSENGER
//const { data, error } = await supabase.auth.signUp({email: 'avesanke@gmail.com', password: '123456'})

////PASSENGER
//const { data, error } = await supabase.auth.signUp({email: 'rotokas38@gmail.com', password: '123456'})

////DRIVER
const { data, error } = await supabase.auth.signUp({email: 'avesanke@gmail.com', password: '123456'})

//SIGN IN
////PASSENGER
//const { data, error } = await supabase.auth.signInWithPassword({ email: "avesanke@gmail.com", password: "123456" })

////PASSENGER
//const { data, error } = await supabase.auth.signInWithPassword({email: 'rotokas38@gmail.com', password: '123456'})

////DRIVER  
//const { data, error } = await supabase.auth.signInWithPassword({ email: "adrisive@hotmail.com", password: "123456" })

console.log(data)
if(error) console.log(error)