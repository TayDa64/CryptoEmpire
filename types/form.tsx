'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { submitEmail } from './action'

export default function EmailForm() {
  const [state, formAction] = useFormState(submitEmail, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black p-8 rounded-lg shadow-md w-96 border border-green-500">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-500">Submit Email</h1>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-green-500">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Submit
          </button>
        </form>
        {state && (
          <div className={`mt-4 text-center ${state.success ? 'text-green-500' : 'text-red-500'}`}>
            {state.message}
          </div>
        )}
      </div>
    </div>
  )
}

