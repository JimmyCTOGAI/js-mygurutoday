import React, { useEffect, useState } from 'react';
import { getAllProfiles, toggleAdminStatus, toggleSuperAdminStatus, type Profile, isSuperAdmin } from '../../lib/auth';

export function AdminPanel() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string |null>(null);
  const [isUserSuperAdmin, setIsUserSuperAdmin] = useState(false);

  useEffect(() => {
    loadProfiles();
    checkSuperAdminStatus();
  }, []);

  async function checkSuperAdminStatus() {
    const superAdmin = await isSuperAdmin();
    setIsUserSuperAdmin(superAdmin);
  }

  async function loadProfiles() {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProfiles();
      setProfiles(data);
    } catch (err) {
      setError('Failed to load profiles');
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleAdmin(userId: string, makeAdmin: boolean) {
    try {
      setError(null);
      const { error } = await toggleAdminStatus(userId, makeAdmin);
      if (error) throw error;
      await loadProfiles();
    } catch (err) {
      setError('Failed to update admin status');
      console.error('Error updating admin status:', err);
    }
  }

  async function handleToggleSuperAdmin(userId: string, makeSuperAdmin: boolean) {
    try {
      setError(null);
      const { error } = await toggleSuperAdminStatus(userId, makeSuperAdmin);
      if (error) throw error;
      await loadProfiles();
    } catch (err) {
      setError('Failed to update super admin status');
      console.error('Error updating super admin status:', err);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {profile.first_name} {profile.last_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{profile.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{profile.phone_number}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {profile.super_admin && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Super Admin
                      </span>
                    )}
                    {profile.is_admin && !profile.super_admin && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Admin
                      </span>
                    )}
                    {!profile.is_admin && !profile.super_admin && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        User
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {isUserSuperAdmin && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleToggleSuperAdmin(profile.id, !profile.super_admin)}
                        className={`block px-3 py-1 rounded-md text-sm font-medium ${
                          profile.super_admin
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {profile.super_admin ? 'Remove Super Admin' : 'Make Super Admin'}
                      </button>
                      {!profile.super_admin && (
                        <button
                          onClick={() => handleToggleAdmin(profile.id, !profile.is_admin)}
                          className={`block px-3 py-1 rounded-md text-sm font-medium ${
                            profile.is_admin
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {profile.is_admin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}