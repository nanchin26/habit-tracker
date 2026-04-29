'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsers, saveSession } from '../../lib/storage'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    const users = getUsers()
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      setError('Invalid email or password')
      return
    }

    saveSession({ userId: user.id, email: user.email })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          Welcome Back
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
          data-testid="auth-login-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          data-testid="auth-login-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          data-testid="auth-login-submit"
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Log In
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}