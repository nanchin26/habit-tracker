'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, getHabits, saveHabits, clearSession } from '../../lib/storage'
import { Habit } from '../../types/habit'
import HabitCard from '../../components/shared/HabitCard'
import HabitForm from '../../components/shared/HabitForm'

export default function DashboardPage() {
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push('/login')
      return
    }

    const allHabits = getHabits()
    const userHabits = allHabits.filter(h => h.userId === session.userId)
    setHabits(userHabits)
  }, [router])

  function handleSave(name: string, description: string) {
    const session = getSession()
    if (!session) return

    const allHabits = getHabits()

    if (editingHabit) {
      const updated = allHabits.map(h =>
        h.id === editingHabit.id
          ? { ...h, name, description }
          : h
      )
      saveHabits(updated)
      setHabits(updated.filter(h => h.userId === session.userId))
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: session.userId,
        name,
        description,
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      }
      const updated = [...allHabits, newHabit]
      saveHabits(updated)
      setHabits(updated.filter(h => h.userId === session.userId))
    }

    setShowForm(false)
    setEditingHabit(null)
  }

  function handleUpdate(updated: Habit) {
    const allHabits = getHabits()
    const newAll = allHabits.map(h => h.id === updated.id ? updated : h)
    saveHabits(newAll)
    setHabits(newAll.filter(h => h.userId === updated.userId))
  }

  function handleDelete(id: string) {
    const session = getSession()
    if (!session) return

    const allHabits = getHabits()
    const updated = allHabits.filter(h => h.id !== id)
    saveHabits(updated)
    setHabits(updated.filter(h => h.userId === session.userId))
  }

  function handleEdit(habit: Habit) {
    setEditingHabit(habit)
    setShowForm(true)
  }

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard</h1>

      <button
        data-testid="auth-logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        data-testid="create-habit-button"
        onClick={() => {
          setEditingHabit(null)
          setShowForm(true)
        }}
      >
        Create Habit
      </button>

      {showForm && (
        <HabitForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingHabit(null)
          }}
          existing={editingHabit ?? undefined}
        />
      )}

      {habits.length === 0 && !showForm && (
        <div data-testid="empty-state">
          <p>No habits yet. Create one!</p>
        </div>
      )}

      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onEdit={handleEdit}
          today={today}
        />
      ))}
    </div>
  )
}