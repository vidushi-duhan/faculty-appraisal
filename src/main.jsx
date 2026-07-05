import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import './index.css'
import Intro from './pages/Intro'
import Faculty from './pages/Faculty'
import Hod from './pages/Hod'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/hod" element={<Hod />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
