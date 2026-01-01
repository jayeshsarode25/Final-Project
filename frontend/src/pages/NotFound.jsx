import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
     <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <h1 className="text-9xl font-extrabold text-gray-800">404</h1>

      <h2 className="mt-4 text-3xl font-semibold text-gray-700">
        Page Not Found
      </h2>

      <p className="mt-2 max-w-md text-center text-gray-500">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-white shadow hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  )
}

export default NotFound