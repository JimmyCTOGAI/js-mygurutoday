import { AuthError, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

export interface UserProfile {
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface Profile {
  id: string
  first_name: string
  last_name: string
  phone_number: string
  email: string
  is_admin: boolean
  super_admin: boolean
  created_at: string
  updated_at: string
}

export async function signUp(
  email: string, 
  password: string, 
  profile: UserProfile
): Promise<AuthResponse> {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone_number: profile.phoneNumber,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error

    if (data.user) {
      // Check if this is the first user
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError

      // First user becomes super admin
      const isFirstUser = count === 0

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            first_name: profile.firstName,
            last_name: profile.lastName,
            phone_number: profile.phoneNumber,
            email: email,
            is_admin: isFirstUser,
            super_admin: isFirstUser
          }
        ])

      if (profileError) throw profileError
    }

    return {
      user: data?.user ?? null,
      error: null
    }
  } catch (err) {
    console.error('Sign up error:', err)
    return {
      user: null,
      error: err as AuthError
    }
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password')
      }
      throw error
    }

    return {
      user: data?.user ?? null,
      error: null
    }
  } catch (err) {
    console.error('Sign in error:', err)
    return {
      user: null,
      error: err as AuthError
    }
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (err) {
    console.error('Sign out error:', err)
    throw err
  }
}

export async function resetPassword(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) throw error
    
    return { error: null }
  } catch (err) {
    console.error('Reset password error:', err)
    return { error: err as Error }
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error getting current profile:', err)
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data?.is_admin ?? false
  } catch (err) {
    console.error('Error checking admin status:', err)
    return false
  }
}

export async function isSuperAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('profiles')
      .select('super_admin')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data?.super_admin ?? false
  } catch (err) {
    console.error('Error checking super admin status:', err)
    return false
  }
}

export async function getAllProfiles(): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error getting all profiles:', err)
    return []
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) throw error
    return { error: null }
  } catch (err) {
    console.error('Error updating profile:', err)
    return { error: err as Error }
  }
}

export async function toggleAdminStatus(
  userId: string,
  makeAdmin: boolean
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: makeAdmin })
      .eq('id', userId)

    if (error) throw error
    return { error: null }
  } catch (err) {
    console.error('Error toggling admin status:', err)
    return { error: err as Error }
  }
}

export async function toggleSuperAdminStatus(
  userId: string,
  makeSuperAdmin: boolean
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        super_admin: makeSuperAdmin,
        is_admin: makeSuperAdmin // Super admins are always admins too
      })
      .eq('id', userId)

    if (error) throw error
    return { error: null }
  } catch (err) {
    console.error('Error toggling super admin status:', err)
    return { error: err as Error }
  }
}