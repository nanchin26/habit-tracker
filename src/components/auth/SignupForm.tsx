'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsers, saveUsers, saveSession } from '../../lib/storage'
import { User } from '../../types/auth'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    const users = getUsers()
    const exists = users.find(u => u.email === email)

    if (exists) {
      setError('User already exists')
      return
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      createdAt: new Date().toISOString()
    }

    saveUsers([...users, newUser])
    saveSession({ userId: newUser.id, email: newUser.email })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <p className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">
            {error}
          </p>
          )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          data-testid="auth-signup-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          data-testid="auth-signup-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          data-testid="auth-signup-submit"
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 font-medium hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )

  }