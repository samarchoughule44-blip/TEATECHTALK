'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const age = formData.get('age') as string
  const roll_no = formData.get('roll_no') as string
  const class_name = formData.get('class_name') as string
  const div = formData.get('div') as string

  if (!email || !password || !name || !age || !roll_no || !class_name || !div) {
    return { error: 'All fields are required' }
  }

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        age,
        roll_no,
        class_name,
        div
      }
    }
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  // Immediately sign in after signup so the user has an active session
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    // Signup succeeded but auto-login failed — send them to login to do it manually
    return { error: 'Account created! Please log in to continue.' }
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}
