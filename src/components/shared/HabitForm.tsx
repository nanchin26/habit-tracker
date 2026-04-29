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
    <div
      data-testid="habit-form"
      className="bg-white rounded-2xl shadow-md p-6 mb-6"
    >
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        {existing ? 'Edit Habit' : 'Create Habit'}
      </h2>

      {error && (
        <p className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Name
      </label>
      <input
        data-testid="habit-name-input"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g. Drink Water"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <input
        data-testid="habit-description-input"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Optional"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Frequency
      </label>
      <select
        data-testid="habit-frequency-select"
        defaultValue="daily"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="daily">Daily</option>
      </select>

      <div className="flex gap-3">
        <button
          data-testid="habit-save-button"
          onClick={handleSave}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}