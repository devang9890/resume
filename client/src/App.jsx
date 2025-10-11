import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Layout from './Pages/Layout'
import ResumeBuilder from './Pages/ResumeBuilder'
import Preview from './Pages/Preview'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'   

const App = () => {
  return (
    <>
      <Routes>
        {/* ✅ Home Route */}
        <Route path="/" element={<Home />} />

        {/* ✅ Nested Routes with Layout */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} /> {/* ✅ Corrected */}
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        {/* ✅ Other Routes */}
        <Route path="/view/:resumeId" element={<Preview />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
