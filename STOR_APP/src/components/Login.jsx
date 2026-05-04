import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../services/api'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleChange(e){
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    try{
      const res = await api.post('/auth/login', { username: form.username, password: form.password })
      const token = res.data.token
      localStorage.setItem('token', token)
      setAuthToken(token)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Error en login')
    }
  }

  return (
    <div className="container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Usuario
          <input name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>Contraseña
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <button type="submit">Ingresar</button>
      </form>
      {error && <p className="message">{error}</p>}
    </div>
  )
}
