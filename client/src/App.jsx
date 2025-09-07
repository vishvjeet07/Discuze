import React, { useEffect, useState } from 'react'
import Home from './components/HomePage/Home'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route, Router } from 'react-router-dom'
import Topic from './components/Topic/Topic'
import Signup from './components/Auth/Signup/Signup'
import Login from './components/Auth/Login/Login'
import Profile from './components/Profile/Profile'
import Loading from './components/Loader/Loading'

function App() {

  return (
    <div className="bg-black text-white min-h-screen">
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/load" element={<Loading />} />
            <Route path="/topic/:name" element={<Topic />} />
            <Route path='/signup' element={<Signup />} /> {/* 👈 this is for Register page */}
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
    </div>
  )
}

export default App
