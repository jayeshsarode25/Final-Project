import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import NotFount from "../pages/NotFound"


const MainRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register />}/>


      
      <Route path='*' element={<NotFount />} />
    </Routes>
  )
}

export default MainRoutes