import { useState, useEffect } from 'react';
import api from '../services/api';

function formatDateInput(d) {
  const date = new Date(d);
  return date.toISOString().slice(0, 10);
}

export default function Reserve() {
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [bookedHours, setBookedHours] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', type: 'peluqueria', hour: 8, notes: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchDay() {
      try {
        const res = await api.get(`/appointments?date=${date}`);
        const hours = res.data.map(a => new Date(a.start).getHours());
        setBookedHours(hours);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDay();
  }, [date]);

  const hours = [];
  for (let h = 8; h <= 18; h++) hours.push(h);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    const start = `${date}T${String(form.hour).padStart(2, '0')}:00:00`;
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        type: form.type,
        start,
        notes: form.notes
      };
      await api.post('/appointments', payload);
      setMessage('Reserva creada correctamente');
      // refresh
      const res = await api.get(`/appointments?date=${date}`);
      setBookedHours(res.data.map(a => new Date(a.start).getHours()));
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Error creando reserva');
    }
  }

  return (
    <div className="container">
      <h2>Reservar cita</h2>
      <div className="reserve-grid">
        <div className="profile-card panel">
          <div className="profile-avatar">
            <img src="/business.svg" alt="Business" />
          </div>
          <div className="business-name">Nombre del Negocio</div>
          <div className="business-desc">Somos especialistas en ofrecer servicios de peluquería y estética con atención personalizada. Reserva tu cita y visita nuestro local para una experiencia profesional y cómoda.</div>
          <hr style={{margin:'16px 0',borderColor:'rgba(0,0,0,0.06)'}} />
          <div className="small">Dirección: Calle Falsa 123</div>
          <div className="small">Tel: +34 600 000 000</div>
        </div>

        <div className="form-panel">
          <form onSubmit={handleSubmit} className="form">
            <label>Fecha
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
            </label>

            <label>Hora
              <select name="hour" value={form.hour} onChange={handleChange}>
                {hours.map(h => (
                  <option key={h} value={h} disabled={bookedHours.includes(h)}>
                    {`${String(h).padStart(2,'0')}:00 ${bookedHours.includes(h)?' (ocupado)':''}`}
                  </option>
                ))}
              </select>
            </label>

            <label>Nombre
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>

            <label>Apellido
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>

            <label>Teléfono
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>

            <label>Tipo
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="peluqueria">peluqueria</option>
                <option value="uñas">uñas</option>
                <option value="otro">otro</option>
              </select>
            </label>

            <label>Notas
              <textarea name="notes" value={form.notes} onChange={handleChange} />
            </label>

            <button type="submit">Reservar</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
