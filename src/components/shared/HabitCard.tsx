'use client'

import { useState } from 'react'
import { Habit } from '../../types/habit'
import { getHabitSlug } from '../../lib/slug'
import { calculateCurrentStreak } from '../../lib/streaks'
import { toggleHabitCompletion } from '../../lib/habits'

type Props = {
  habit: Habit
  onUpdate: (habit: Habit) => void
  onDelete: (id: string) => void
  onEdit: (habit: Habit) => void
  today: string
}

export default function HabitCard({ habit, onUpdate, onDelete, onEdit, today }: Props) {
  const slug = getHabitSlug(habit.name)
  const streak = calculateCurrentStreak(habit.completions, today)
  const isCompleted = habit.completions.includes(today)
  const [showConfirm, setShowConfirm] = useState(false)

  function handleToggle() {
    const updated = toggleHabitCompletion(habit, today)
    onUpdate(updated)
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`bg-white rounded-2xl shadow-sm p-5 mb-4 border-l-4 ${
        isCompleted ? 'border-green-500' : 'border-indigo-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{habit.name}</h3>
          {habit.description && (
            <p className="text-gray-500 text-sm mt-1">{habit.description}</p>
          )}
        </div>
        <span
          data-testid={`habit-streak-${slug}`}
          className="bg-indigo-50 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full"
        >
          🔥 {streak}
        </span>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            isCompleted
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isCompleted ? '✓ Completed' : 'Mark Complete'}
        </button>

        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Edit
        </button>

        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition"
        >
          Delete
        </button>
      </div>

      {showConfirm && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-600 text-sm font-medium mb-3">
            Are you sure you want to delete this habit?
          </p>
          <div className="flex gap-2">
            <button
              data-testid="confirm-delete-button"
              onClick={() => onDelete(habit.id)}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}