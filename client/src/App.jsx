import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Layout from './Pages/Layout'
import ResumeBuilder from './Pages/ResumeBuilder'
import Preview from './Pages/Preview'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'   
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { setLoading, login } from './app/features/authSlice'
import {Toaster } from 'react-hot-toast'

const App = () => {

  const dispatch = useDispatch()

  const getUserData = async()=>{
    const token = localStorage.getItem('token')
    try{
      if(token){
        const { data } = await api.get('/api/users/data' , {headers: {Authorization:token}})
        if(data.user){
          dispatch(login({token , user : data.user}))
        }
        dispatch(setLoading(false))
      }else{
        dispatch(setLoading(false))
      }
    } catch(error) {
      dispatch(setLoading(false))
      console.log(error.message)

    }
  }

  useEffect(()=>{},[
    getUserData()
  ])
  return (
    <>
    <Toaster/>
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
        
      </Routes>
    </>
  )
}

export default App
