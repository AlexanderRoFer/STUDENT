# Plan para app de Citas (agendamiento)

## Resumen
Aplicación web sencilla para agendar citas en un único calendario gestionado por un administrador. Usaremos `yarn` como gestor de paquetes, CSS (SCSS o Tailwind según prefieras) para estilos y MongoDB como base de datos. El backend se implementará con Express (opción simple, ampliamente compatible con Mongoose y middlewares).

## Stack elegido
- Frontend: React + Vite
- Estilos: CSS (puedes usar SCSS o Tailwind)
- Backend: Node.js + Express
- Base de datos: MongoDB (Atlas recomendado)
- ODM: Mongoose
- Autenticación: JWT para panel admin (si es necesario)

## Reglas de negocio principales (según tu indicación)
- Campos obligatorios para cada cita: `nombre`, `apellido`, `telefono`, `tipoDeCita`.
- `tipoDeCita` es un select con tres opciones: `peluqueria`, `uñas`, `otro`.
- Los turnos son horarios fijos por defecto: cada hora, empezando a las 08:00 (8:00, 9:00, 10:00...).
- Solo el admin (tú) puede cancelar o eliminar una cita; el cliente no puede cancelar.
- La aplicación trabajará con un único registro/agenda (sin cuentas clientes públicas para cancelar).

## Esquema de datos (Mongoose) sugerido

```js
const AppointmentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, enum: ['peluqueria', 'uñas', 'otro'], required: true },
  start: { type: Date, required: true },
  status: { type: String, enum: ['pendiente','confirmado','cancelado'], default: 'pendiente' },
  notes: String
}, { timestamps: true });

// Índice para consultas por fecha
AppointmentSchema.index({ start: 1 });
```

Notas sobre `start`:
- `start` debe corresponder a una franja horaria válida (hora exacta, minutos = 0).
- Al crear cita, el backend validará que la hora solicitada sea una hora completa y esté dentro del rango permitido (p.ej., 08:00–18:00).

## Endpoints API (restricciones admin)
- `GET /api/appointments?date=YYYY-MM-DD&range=day|week|month` — listar por rango.
- `GET /api/appointments/:id` — ver detalle.
- `POST /api/appointments` — crear cita (cliente o admin puede crear).
- `PUT /api/appointments/:id` — editar (limitado según reglas; p.ej., solo admin puede cambiar status).
- `DELETE /api/appointments/:id` — eliminar/cancelar (solo admin).

Implementa autorización en las rutas `PUT` y `DELETE` para garantizar que solo el admin pueda cancelar/editar estados críticos.

## Lógica de disponibilidad (frontend/backend)
- Frontend mostrará franjas horarias generadas automáticamente: horas desde 08:00 en adelante, cada hora.
- Al consultar disponibilidad para un día, el backend devolverá las horas ya tomadas y el frontend mostrará solo las horas libres.
- Validación adicional en backend: atómico (chequear si ya existe cita en esa hora antes de insertar) para evitar dobles reservas.

## Paso a paso de implementación (ajustado)
1. Preparar entorno
   - Instalar Node.js (LTS) y `yarn`.
   - Crear cuenta en MongoDB Atlas o preparar instancia MongoDB.

2. Inicializar frontend (Vite + React) con `yarn` y configurar CSS

```bash
yarn create vite my-citas-app --template react
cd my-citas-app
yarn
# instalar dependencias básicas
yarn add react-router-dom axios
# instalar SCSS si lo usas
yarn add -D sass
```

3. Inicializar backend (Express + Mongoose)

```bash
mkdir backend && cd backend
yarn init -y
yarn add express mongoose cors dotenv helmet
```

- Crear `server.js` con conexión a MongoDB usando `process.env.MONGO_URI`.
- Rutas: `routes/appointments.js` (con validaciones de horario) y `routes/admin.js` para acciones administrativas.

4. Reglas y validaciones concretas
- Al crear cita: validar `firstName`, `lastName`, `phone`, `type` y que `start` sea una hora entera >=08:00.
- Backend debe rechazar reservas en horas ya tomadas; usar operación atómica (`findOneAndUpdate` con condición de inexistencia o transacción si usas replica set).

5. Panel admin
- Añadir endpoint de autenticación para admin y proteger rutas de eliminación/edición de estado.

6. UI
- Pantallas: `Reservar` (formulario y selección de hora), `Agenda` (vista por día/semana), `Panel Admin` (lista completa y acciones de cancelar).

7. Pruebas y despliegue
- Tests básicos para creación y bloqueo de horas duplicadas.
- Despliegue: frontend en Vercel/Netlify, backend en Render/Railway, DB en MongoDB Atlas.

## Resumen operativo
- El flujo típico: cliente llena formulario (nombre, apellido, teléfono, tipo), selecciona una hora libre (hora entera desde 08:00). El sistema reserva la franja; solo el admin podrá cancelar.
- Esto simplifica soporte y evita que clientes borren reservas.

## ¿Quieres que genere el boilerplate (frontend + backend) ahora usando `yarn` y `express` con estas reglas de negocio? 

Fecha del plan actualizado: 2026-04-23
