import React, { Fragment, useState, useCallback, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { FiUser, FiKey, FiLogOut, FiStar, FiSettings, FiHelpCircle, FiCreditCard } from 'react-icons/fi'
import { EditableAvatar } from './EditableAvatar'
import { supabase } from '../lib/supabase'
import { getCurrentProfile, type Profile } from '../lib/auth'

interface UserMenuProps {
  userAvatar: string
  onAvatarUpdate: (url: string) => void
}

export function UserMenu({ userAvatar, onAvatarUpdate }: UserMenuProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const userProfile = await getCurrentProfile()
    setProfile(userProfile)
  }

  const handlePasswordChange = async () => {
    if (isLoading) return
    
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setSuccess('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setIsChangingPassword(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = useCallback(() => {
    window.open('https://myguruu.ai/upgrade', '_blank', 'noopener,noreferrer')
  }, [])

  const handleSettings = useCallback(() => {
    console.log('Opening settings...')
  }, [])

  const handleSupport = useCallback(() => {
    window.open('https://support.myguruu.ai', '_blank', 'noopener,noreferrer')
  }, [])

  const handleBilling = useCallback(() => {
    window.open('https://myguruu.ai/billing', '_blank', 'noopener,noreferrer')
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      window.location.reload()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }, [])

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center focus:outline-none">
        <EditableAvatar 
          imageUrl={userAvatar}
          alt="User avatar"
          onUpdate={onAvatarUpdate}
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <EditableAvatar 
                imageUrl={userAvatar}
                alt="User avatar"
                size="lg"
                onUpdate={onAvatarUpdate}
              />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
                </h3>
                <p className="text-xs text-gray-500">{profile?.email}</p>
                <p className="text-xs text-gray-500">
                  {profile?.super_admin 
                    ? 'Super Admin' 
                    : profile?.is_admin 
                      ? 'Admin' 
                      : 'User'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-2 bg-green-50 text-green-600 text-sm rounded">
                {success}
              </div>
            )}

            {isChangingPassword ? (
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={8}
                  required
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={8}
                  required
                  disabled={isLoading}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handlePasswordChange}
                    disabled={isLoading || !currentPassword || !newPassword}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false)
                      setCurrentPassword('')
                      setNewPassword('')
                      setError(null)
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleUpgrade}
                      className={`${
                        active ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                      } flex items-center w-full px-4 py-2 text-sm rounded font-medium`}
                    >
                      <FiStar className="w-5 h-5 mr-3" />
                      Upgrade to Pro
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSettings}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded`}
                    >
                      <FiSettings className="mr-3" />
                      Settings
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleBilling}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded`}
                    >
                      <FiCreditCard className="mr-3" />
                      Billing
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSupport}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded`}
                    >
                      <FiHelpCircle className="mr-3" />
                      Support
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded`}
                    >
                      <FiKey className="mr-3" />
                      Change Password
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      disabled={isLoading}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <FiLogOut className="mr-3" />
                      {isLoading ? 'Signing out...' : 'Sign Out'}
                    </button>
                  )}
                </Menu.Item>
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}