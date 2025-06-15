import React, { useState, useEffect } from 'react'
import { openDB } from 'idb'

const habitsList = ["Study", "Exercise", "Read", "Meditate"]

export default function App() {
  const [habits, setHabits] = useState({})

  useEffect(() => {
    const init = async () => {
      const db = await openDB('habits-db', 1, {
        upgrade(db) {
          db.createObjectStore('habits')
        }
      })
      const allHabits = {}
      for (let habit of habitsList) {
        const done = await db.get('habits', habit)
        allHabits[habit] = done || false
      }
      setHabits(allHabits)
    }
    init()
  }, [])

  const toggleHabit = async (habit) => {
    const db = await openDB('habits-db', 1)
    const updated = { ...habits, [habit]: !habits[habit] }
    setHabits(updated)
    await db.put('habits', updated[habit], habit)
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-100 to-purple-100">
      <h1 className="text-3xl font-bold text-center mb-6">Habit Tracker</h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4">
        {habitsList.map(habit => (
          <div key={habit} className="flex items-center justify-between">
            <span className="text-lg font-medium">{habit}</span>
            <button
              onClick={() => toggleHabit(habit)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                habits[habit] ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
              }`}
            >
              {habits[habit] ? "Done" : "Mark"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
