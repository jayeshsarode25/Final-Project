import React from 'react'

const Login = () => {
  return (
    <div>
      <div>
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" placeholder='email@email.com' id='email' required />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input type="password" placeholder='password' id='password' required />
          </div>

          <button type='submit'>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login