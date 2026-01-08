import React from "react";

const Register = () => {
  return (
    <div className="h-screen w-full max-w-full bg-gray-950 flex flex-col justify-center items-center text-white">
      <div className="flex flex-col justify-center items-center border-2 p-10 rounded-lg w-11/12 max-w-md">
        <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
        <p className="text-lg font-semibold mb-5">Register to get started</p>

        <button className="flex items-center justify-center w-full bg-gray-200 rounded-md text-black text-lg font-semibold py-2 mb-6 hover:bg-gray-300 transition">
          <span className="bg-white text-blue-700 font-bold rounded-full w-7 h-7 flex items-center justify-center mr-2">G</span>
          continue with Google
        </button>

        <div className="flex items-center justify-center w-full my-4">
          <div className="grow border-t border-gray-400"></div>
          <span className="mx-4 text-gray-400 text-sm">OR</span>
          <div className="grow border-t border-gray-400"></div>
        </div>

        <form className="w-full p-5 rounded-lg space-y-4">
          <div className="flex flex-col">
            <label className="text-lg font-medium" htmlFor="email">Email</label>
            <input 
            type="email" 
            placeholder="email@email.com" 
            id="email" 
            required
            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col">
              <label className="text-lg font-medium" htmlFor="first name">First name</label>
              <input type="text" placeholder="First name" id="first name" required 
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"/>
            </div>
            <div>
              <label className="text-lg font-medium" htmlFor="last name">Last name</label>
              <input type="text" placeholder="Last name" id="last name" required
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <fieldset >
            <legend >
              Account type
            </legend>
            <div >
              <label >
                <input
                  type="radio"
                  name="userType"
                  value="user"

                  
                  
                />
                <span>User</span>
              </label>
              <label >
                <input
                  type="radio"
                  name="userType"
                  value="admin"
                  
                  
                  
                />
                <span>Admin</span>
              </label>
            </div>
          </fieldset>

          <div className="flex flex-col">
            <label className="text-lg font-medium" htmlFor="password">
              Password
            </label>
            <div>
              <input type="password" placeholder="*******" id="password" minLength={8} required
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters.</p>
            </div>
          </div>

          <button type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
