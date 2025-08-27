import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage.jsx'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes path="/*">
      <Route path="/" element={<HomePage />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
