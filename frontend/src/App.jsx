import React from 'react'
import MainRoutes from './routes/MainRoutes'
import Navbar from './component/navbar/Navbar'

const App = () => {
  return (
    <div className='h-screen w-full bg-linear-to-b from-[#010528] to-[#004B8E] text-white'>

      <Navbar />

      <MainRoutes/>
    </div>
  )
}

export default App