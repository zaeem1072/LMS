import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/login'
import Signup from './components/signup'
import Student from './components/student'
import Teacher from './components/teacher'
import Admin from './components/admin'
import MiniAdmin from './components/mini-admin'
import { useState} from 'react'
import { ToastProvider } from './contexts/ToastContext'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  const [role, setRole] = useState<string | null>(() => {
    return localStorage.getItem('userRole')
  })

  return (
    <ToastProvider position="top-right">
        <Router>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login
                  onLogin={(userRole: string) => {
                    setIsAuthenticated(true)
                    setRole(userRole)
                  }}
                />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Signup
                  onSignup={(userRole: string) => {
                    setIsAuthenticated(true)
                    setRole(userRole)
                  }}
                />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <>
                  {role === 'student' && <Navigate to="/student" replace />}
                  {role === 'teacher' && <Navigate to="/teacher" replace />}
                  {role === 'admin' && <Navigate to="/admin" replace />}
                  {role === 'mini_admin' && <Navigate to="/mini-admin" replace />}
                  {!role && <Navigate to="/login" replace />}
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          <Route
            path="/teacher/*"
            element={
              isAuthenticated && role === 'teacher' ? (
                <Teacher 
                  onLogout={() => {
                    setIsAuthenticated(false)
                    setRole(null)
                  }} 
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          <Route
            path="/student/*"
            element={
              isAuthenticated && role === 'student' ? (
                <Student 
                  onLogout={() => {
                    setIsAuthenticated(false)
                    setRole(null)
                  }} 
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          <Route
            path="/admin/*"
            element={
              isAuthenticated && role === 'admin' ? (
                <Admin 
                  onLogout={() => {
                    setIsAuthenticated(false)
                    setRole(null)
                  }} 
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          <Route
            path="/mini-admin/*"
            element={
              isAuthenticated && role === 'mini_admin' ? (
                <MiniAdmin 
                  onLogout={() => {
                    setIsAuthenticated(false)
                    setRole(null)
                  }} 
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
