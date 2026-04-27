'use client'

import { useState } from 'react'
import { Habit } from '../../types/habit'
import { validateHabitName } from '../../lib/validators'

type Props = {
  onSave: (name: string, description: string) => void
  onCancel: () => void
  existing?: Habit
}

export default function HabitForm({ onSave, onCancel, existing }: Props) {
  const [name, setName] = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [error, setError] = useState('')

  function handleSave() {
    const result = validateHabitName(name)

    if (!result.valid) {
      setError(result.error!)
      return
    }

    onSave(result.value, description)
  }

  return (
    <div data-testid="habit-form">
      <h2>{existing ? 'Edit Habit' : 'Create Habit'}</h2>

      {error && <p>{error}</p>}

      <label>Name</label>
      <input
        data-testid="habit-name-input"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <label>Description</label>
      <input
        data-testid="habit-description-input"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <label>Frequency</label>
      <select
        data-testid="habit-frequency-select"
        defaultValue="daily"
      >
        <option value="daily">Daily</option>
      </select>

      <button
        data-testid="habit-save-button"
        onClick={handleSave}
      >
        Save
      </button>

      <button onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}