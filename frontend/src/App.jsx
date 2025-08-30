import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage.jsx'
import SignUpPage from './pages/signupPage.jsx'
import LoginPage from './pages/loginPage.jsx'
import AdminHomePage from './pages/adminHomePage.jsx'
import PortStatusPage from './pages/portStatusPage.jsx'
import PortBookingPage from './pages/portBookingPage.jsx'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes path="/*">
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/port-status" element={<PortStatusPage />} />
      <Route path="/port-booking/:portId" element={<PortBookingPage />} />
      <Route path="/admin/*" element={<AdminHomePage />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
