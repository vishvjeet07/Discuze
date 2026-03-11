import React from 'react'
import Home from './components/HomePage/Home'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Topic from './components/Topic/Topic'
import Signup from './components/Auth/Signup/Signup'
import Login from './components/Auth/Login/Login'
import Profile from './components/Profile/Profile'
import Loading from './components/Loader/Loading'
import { Toaster } from 'react-hot-toast'

function App() {
  const location = useLocation();

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/load" element={<Loading />} />
          <Route path="/topic/:name" element={<Topic key={location.pathname} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'var(--font-sans)',
            background: '#1c1c26',
            color: '#f0f0f5',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            padding: '10px 14px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#1c1c26' },
          },
          error: {
            iconTheme: { primary: '#e63946', secondary: '#1c1c26' },
          },
        }}
      />
    </div>
  )
}

export default App
