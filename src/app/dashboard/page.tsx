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
  const [email, setEmail] = useState('')
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push('/login')
      return
    }

    setEmail(session.email)
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
    <div
      data-testid="dashboard-page"
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-indigo-600 px-4 py-5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Habit Tracker</h1>
            <p className="text-indigo-200 text-sm">{email}</p>
          </div>
          <button
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-400 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-md mx-auto px-4 py-6">

        {/* Create button */}
        {!showForm && (
          <button
            data-testid="create-habit-button"
            onClick={() => {
              setEditingHabit(null)
              setShowForm(true)
            }}
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition mb-6"
          >
            + Create Habit
          </button>
        )}

        {/* Habit form */}
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

        {/* Empty state */}
        {habits.length === 0 && !showForm && (
          <div
            data-testid="empty-state"
            className="text-center py-16"
          >
            <p className="text-4xl mb-4">🌱</p>
            <p className="text-gray-500 font-medium">No habits yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Create your first habit to get started
            </p>
          </div>
        )}

        {/* Habit list */}
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
    </div>
  )
}