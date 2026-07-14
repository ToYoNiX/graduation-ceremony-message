import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Reveal from './pages/Reveal'
import Submit from './pages/Submit'
import ManageSearch from './pages/ManageSearch'
import Manage from './pages/Manage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter keeps routing working on GitHub Pages with no server config. */}
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/message/:id" element={<Reveal />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/manage" element={<ManageSearch />} />
          <Route path="/manage/:id" element={<Manage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
