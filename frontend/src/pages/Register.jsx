import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/reducer/userSlice";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    userType: "user",
  });

  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-6 text-white">
      <div className="w-full max-w-sm sm:max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-5 sm:p-6">

        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          Create Account
        </h1>
        <p className="text-center text-gray-400 text-sm mt-1 mb-4">
          Register to get started
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Username */}
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Account Type */}
          <fieldset>
            <legend className="text-sm font-medium mb-1 text-gray-300">
              Account Type
            </legend>
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  checked={form.userType === "user"}
                  onChange={handleChange}
                  className="accent-blue-500"
                />
                User
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="seller"
                  checked={form.userType === "seller"}
                  onChange={handleChange}
                  className="accent-blue-500"
                />
                Seller
              </label>
            </div>
          </fieldset>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
              className="mt-1 w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 text-sm font-semibold rounded-md disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Messages */}
          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-xs text-center">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
