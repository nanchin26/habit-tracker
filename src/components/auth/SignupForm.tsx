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
    <div>
      <h1>Sign Up</h1>
      {error && <p>{error}</p>}
      <label>Email</label>
      <input
        data-testid="auth-signup-email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <label>Password</label>
      <input
        data-testid="auth-signup-password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        data-testid="auth-signup-submit"
        onClick={handleSubmit}
      >
        Sign Up
      </button>
    </div>
  )
}