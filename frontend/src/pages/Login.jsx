import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/reducer/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {


  const [form, setForm] = useState({
    email:'',
    username:'',
    password:''
  })

  const navigate = useNavigate()

  const dispatch = useDispatch();

  const {loading, error, success, message} = useSelector((state) => state.auth)


  function handleChange(e){
    const {name, value} = e.target;
    setForm((prev)=> ({...prev,[name]:value}))
  }


  function handleSubmit(e){
    e.preventDefault()
    dispatch(loginUser(form))

    navigate("/")
  }


  return (
    <div className='min-h-screen bg-gray-950 flex justify-center items-center px-4 py-3 text-white'>
      <div className='w-full max-w-sm sm:max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-5 sm:p-6'>
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          Login to Market
        </h1>
        <p className="text-center text-gray-400 text-sm mt-1 mb-4">
          Login to get started
        </p>

        {/* Google Button */}
        <button className="flex items-center justify-center w-full bg-gray-200 text-black rounded-md py-2 text-sm font-semibold hover:bg-gray-300 transition">
          <span className="bg-white text-blue-700 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">
            G
          </span>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="grow border-t border-gray-700"></div>
          <span className="px-3 text-gray-400 text-xs">OR</span>
          <div className="grow border-t border-gray-700"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium" htmlFor="username">Username</label>
            <input 
            type="text" 
            placeholder='username' 
            name='username' 
            id='username'
            onChange={handleChange}
            value={form.username} 
            className="mt-1 w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required 
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input 
            type="email"
            placeholder='email@email.com' 
            name='email' 
            id='email' 
            onChange={handleChange}
            value={form.email}
            className="mt-1 w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required 
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <input 
            type="password" 
            placeholder='password' 
            name='password'
            id='password' 
            onChange={handleChange}
            value={form.password}
            className="mt-1 w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 text-sm font-semibold rounded-md disabled:opacity-60" 
          type='submit'>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login