'use client'
import { useState } from 'react';
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
    <div data-testid={`habit-card-${slug}`}>
      <h3>{habit.name}</h3>
      <p>{habit.description}</p>
      <p data-testid={`habit-streak-${slug}`}>Streak: {streak}</p>

      <button
        data-testid={`habit-complete-${slug}`}
        onClick={handleToggle}
      >
        {isCompleted ? 'Unmark' : 'Mark Complete'}
      </button>

      <button
        data-testid={`habit-edit-${slug}`}
        onClick={() => onEdit(habit)}
      >
        Edit
      </button>

      <button
        data-testid={`habit-delete-${slug}`}
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </button>

      {showConfirm && (
        <div>
          <p>Are you sure you want to delete this habit?</p>
          <button
            data-testid="confirm-delete-button"
            onClick={() => onDelete(habit.id)}
          >
            Yes, Delete
          </button>
          <button onClick={() => setShowConfirm(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}