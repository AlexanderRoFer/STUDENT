import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Agenda() {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [list, setList] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/appointments?date=${date}`);
        setList(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [date]);

  return (
    <div className="container">
      <h2>Agenda - {date}</h2>
      <label>Fecha
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
      </label>
      <ul className="list">
        {list.length === 0 && <li>No hay citas</li>}
        {list.map(a => (
          <li key={a._id}>
            <strong>{new Date(a.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong> — {a.firstName} {a.lastName} ({a.type})
          </li>
        ))}
      </ul>
    </div>
  );
}
