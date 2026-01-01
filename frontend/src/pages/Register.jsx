import React from "react";

const Register = () => {
  return (
    <div>
      <div>
        <h1>create your account</h1>
        <p>Register to get started</p>

        <button>
          <span>G</span>
          continue with Google
        </button>

        <div>
          <div>
            <span>OR</span>
          </div>
        </div>

        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" placeholder="email@email.com" id="email" required/>
          </div>

          <div>
            <div>
              <label htmlFor="first name">First name</label>
              <input type="text" placeholder="First name" id="first name" required/>
            </div>
            <div>
              <label htmlFor="last name">Last name</label>
              <input type="text" placeholder="Last name" id="last name" required/>
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

          <div>
            <label htmlFor="password">
              Password
            </label>
            <div>
              <input type="password" placeholder="*******" id="password" minLength={8} required/>
              <p>Minimum 8 characters.</p>
            </div>
          </div>

          <button type="submit">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
