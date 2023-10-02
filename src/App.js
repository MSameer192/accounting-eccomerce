import React, { lazy, useEffect } from 'react'
import { useDispatch } from 'react-redux';       
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { themeChange } from 'theme-change'
import checkAuth from './app/auth';
import initializeApp from './app/init';
import { getUsersById } from './features/settings/profilesettings/profileSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// Importing pages
const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Register = lazy(() => import('./pages/Register'))


// Initializing different libraries
initializeApp()


// Check for login and initialize axios
const token = checkAuth()


function App() {

const dispatch = useDispatch()

  useEffect(() => {
    // 👆 daisy UI themes initialization
    themeChange(false)
    dispatch(getUsersById())
    console.log("inside the app.js");
  }, [])


  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          
          {/* Place new routes over this */}
          <Route path="/app/*" element={<Layout />} />

          <Route path="*" element={<Navigate to={token ? "/app/welcome" : "/login"} replace />}/>

        </Routes>
      </Router>

      {/* Notification Container */}
      <ToastContainer />

    </>
  )
}

export default App
