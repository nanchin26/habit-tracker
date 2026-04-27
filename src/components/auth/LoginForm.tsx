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
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <label>Email</label>
      <input
        data-testid="auth-login-email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <label>Password</label>
      <input
        data-testid="auth-login-password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        data-testid="auth-login-submit"
        onClick={handleSubmit}
      >
        Log In
      </button>
    </div>
  )
}