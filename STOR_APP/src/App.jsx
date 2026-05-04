import '@styles/globals.scss'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Reserve from './components/Reserve'
import Agenda from './components/Agenda'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'
import { setAuthToken } from './services/api'

function Header() {
  const navigate = useNavigate();
  const token = (()=>{ try { return localStorage.getItem('token'); } catch (e) { return null }})();
  function handleLogout(){
    try { localStorage.removeItem('token'); } catch (e) {}
    setAuthToken(null);
    navigate('/login');
  }
  return (
    <header className="site-header">
      <nav>
        <Link to="/">Reservar</Link>
        <Link to="/agenda">Agenda</Link>
        <Link to="/admin">Admin</Link>
        {token && <button className="logout" onClick={handleLogout}>Logout</button>}
      </nav>
    </header>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Reserve/>} />
          <Route path="/agenda" element={<Agenda/>} />
          <Route path="/admin" element={<AdminPanel/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App