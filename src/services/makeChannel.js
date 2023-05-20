import { supabase } from './supabase'

export function makeChannel ({ channelName, eventType, filter, callback }) {
  const channel = supabase.channel(channelName).on(eventType, filter, callback).subscribe()
  return channel
}
