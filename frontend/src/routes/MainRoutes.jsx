import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import NotFount from "../pages/NotFound"
import ProductPage from '../pages/ProductPage'
import AiBuddy from '../component/navbar/AiBuddy'
import AboutUs from '../pages/AboutUs'
import Cart from '../component/navbar/Cart'


const MainRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register />}/>
      <Route path='/product' element={<ProductPage />}/>
      <Route path='/ai-buddy' element={<AiBuddy />}/>
      <Route path='/about-us' element={<AboutUs/>}/>
      <Route path='/cart' element={<Cart/>}/>


      
      <Route path='*' element={<NotFount />} />
    </Routes>
  )
}

export default MainRoutes