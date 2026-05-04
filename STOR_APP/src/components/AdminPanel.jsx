import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminPanel() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = (() => { try { return localStorage.getItem('token'); } catch (e) { return null }})();
    if (!token) return navigate('/login');
    loadAll();
  }, []);

  async function loadAll(){
    try {
      const res = await api.get('/appointments');
      setList(res.data);
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id){
    if(!confirm('Confirmar eliminación de la cita?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      setList(prev => prev.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  }

  return (
    <div className="container">
      <h2>Panel Admin</h2>
      <ul className="list">
        {list.length === 0 && <li>No hay citas</li>}
        {list.map(a => (
          <li key={a._id}>
            {new Date(a.start).toLocaleString()} — {a.firstName} {a.lastName} ({a.type})
            <button className="danger" onClick={()=>handleDelete(a._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
