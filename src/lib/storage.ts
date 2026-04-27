import { User, Session } from '../types/auth'
import { Habit } from '../types/habit'

const USERS_KEY = 'habit-tracker-users'
const SESSION_KEY = 'habit-tracker-session'
const HABITS_KEY = 'habit-tracker-habits'

// USERS
export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// SESSION
export function getSession(): Session | null {
  const data = localStorage.getItem(SESSION_KEY)
  return data ? JSON.parse(data) : null
}

export function saveSession(session: Session | null): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

// HABITS
export function getHabits(): Habit[] {
  const data = localStorage.getItem(HABITS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}