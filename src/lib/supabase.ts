import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  // Helps catch a missing .env early instead of a cryptic runtime error.
  throw new Error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
  )
}

// This client only ever holds the PUBLIC anon/publishable key. All real
// authorization happens server-side in Postgres (RLS + SECURITY DEFINER
// functions). See supabase/schema.sql.
export const supabase = createClient(supabaseUrl, supabaseKey)

export type GraduateName = {
  id: string
  name: string
  created_at: string
}

/** All graduate names (message content stays hidden). */
export async function listNames(): Promise<GraduateName[]> {
  const { data, error } = await supabase
    .from('public_names')
    .select('id, name, created_at')
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

/** Reveal a message — only succeeds if the code is correct. */
export async function revealMessage(id: string, code: string): Promise<string> {
  const { data, error } = await supabase.rpc('reveal_message', {
    p_id: id,
    p_code: code,
  })
  if (error) throw error
  return data as string
}

/** Submit a new message. Returns the new row id. */
export async function submitMessage(
  name: string,
  message: string,
  code: string,
): Promise<string> {
  const { data, error } = await supabase.rpc('submit_message', {
    p_name: name,
    p_message: message,
    p_code: code,
  })
  if (error) throw error
  return data as string
}

/** Update a message — only succeeds if the code is correct. */
export async function updateMessage(
  id: string,
  code: string,
  newMessage: string,
): Promise<void> {
  const { error } = await supabase.rpc('update_message', {
    p_id: id,
    p_code: code,
    p_new_message: newMessage,
  })
  if (error) throw error
}

/** Delete a message — only succeeds if the code is correct. */
export async function deleteMessage(id: string, code: string): Promise<void> {
  const { error } = await supabase.rpc('delete_message', {
    p_id: id,
    p_code: code,
  })
  if (error) throw error
}
