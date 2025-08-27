import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage.jsx'
import SignUp from './pages/signupPage.jsx'
import Login from './pages/loginPage.jsx'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes path="/*">
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
