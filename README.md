# QuickTalk API

## Índice
- Resumen del Proyecto  
- Características  
- Tecnologías Utilizadas  
- Arquitectura del Backend  
- Variables de Entorno  
- API Endpoints  
- WebSockets (Socket.IO)  
- Modelos de Datos  
- Seguridad  
- Despliegue  
- Capturas de Pantalla  

---

## Resumen del Proyecto
QuickTalk es una aplicación de mensajería en tiempo real desarrollada con Node.js y Socket.IO. Permite la comunicación instantánea entre usuarios mediante chats privados y grupales, incluyendo envío de mensajes, imágenes, eventos en vivo y gestión de contactos.

El sistema está diseñado para ofrecer una experiencia fluida, segura y escalable, integrando autenticación, validación de datos y comunicación bidireccional en tiempo real.

---

## Características
- Mensajería en tiempo real con Socket.IO  
- Chats privados y grupales  
- Indicadores de escritura en vivo  
- Gestión de contactos  
- Envío de imágenes  
- Sistema de eventos en chats (entradas, salidas, cambios)  
- Autenticación con JWT  
- Verificación de usuario (simulada con Firebase)  
- Protección contra bots y abuso (Arcjet)  
- Sistema de colas para procesos asíncronos  

---

## Tecnologías Utilizadas

| Tecnología        | Propósito |
|------------------|----------|
| Node.js + Express | Backend y API REST |
| MongoDB + Mongoose | Base de datos |
| Socket.IO | Comunicación en tiempo real |
| JWT | Autenticación |
| Cloudinary | Almacenamiento de imágenes |
| Firebase | Verificación de teléfono |
| Arcjet | Seguridad y rate limiting |
| Bull + Redis | Colas de trabajos |

---

## Arquitectura del Backend
El backend sigue una arquitectura modular basada en capas:

- Controladores: lógica de negocio  
- Modelos: estructura de datos  
- Rutas: definición de endpoints  
- Middlewares: validación, autenticación y control  
- Servicios: integraciones externas  
- WebSockets: comunicación en tiempo real  

---
## Variables de entorno
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_KEY=your_jwt_secret_key
EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email

REDIS_HOST=localhost
REDIS_PORT=6379

ARCJET_KEY=your_arcjet_key

--
## API endpoints
Autenticación (/api/auth)
| Método | Endpoint         | Descripción         | Auth |
| ------ | ---------------- | ------------------- | ---- |
| POST   | /signup          | Registro de usuario | No   |
| POST   | /login           | Inicio de sesión    | No   |
| POST   | /logout          | Cierre de sesión    | No   |
| PUT    | /profile-picture | Actualizar foto     | Sí   |
| PUT    | /update-profile  | Actualizar datos    | Sí   |
| GET    | /check           | Verificar token     | Sí   |
| POST   | /verify-phone    | Verificar teléfono  | Sí   |

Contactos (/api/contacts)

| Método | Endpoint    | Descripción       | Auth |
| ------ | ----------- | ----------------- | ---- |
| GET    | /           | Obtener contactos | Sí   |
| POST   | /add        | Agregar contacto  | Sí   |
| DELETE | /:id/remove | Eliminar contacto | Sí   |
| PUT    | /:id/edit   | Editar contacto   | Sí   |


Chats (/api/chats)
| Método | Endpoint                | Descripción        | Auth |
| ------ | ----------------------- | ------------------ | ---- |
| GET    | /                       | Obtener chats      | Sí   |
| POST   | /groups                 | Crear grupo        | Sí   |
| POST   | /                       | Crear chat privado | Sí   |
| GET    | /:id/messages           | Obtener mensajes   | Sí   |
| POST   | /:id/messages           | Enviar mensaje     | Sí   |
| PUT    | /:id                    | Actualizar chat    | Sí   |
| GET    | /:id/events             | Eventos del chat   | Sí   |
| GET    | /:id/invite-link        | Generar invitación | Sí   |
| GET    | /invite/:token/validate | Validar link       | Sí   |
| POST   | /invite/:token/join     | Unirse             | Sí   |
| POST   | /:id/leave              | Salir del grupo    | Sí   |

Mensajes (/api/messages)
| Método | Endpoint | Descripción      | Auth |
| ------ | -------- | ---------------- | ---- |
| DELETE | /:id     | Eliminar mensaje | Sí   |


## Websockets
| Evento         | Descripción              |
| -------------- | ------------------------ |
| new-message    | Nuevo mensaje            |
| delete-message | Eliminación de mensaje   |
| typing         | Usuario escribiendo      |
| stopTyping     | Usuario deja de escribir |
| getOnlineUsers | Usuarios en línea        |

## Modelos de datos
<img width="1536" height="1024" alt="ChatGPT Image 6 may 2026, 08_28_33" src="https://github.com/user-attachments/assets/69c8ba56-eee2-44da-8985-c1d82496b209" />
--
## Seguridad

Autenticación con JWT en cookies
Hash de contraseñas
Validación de datos
Protección contra bots (Arcjet)
Rate limiting
Sanitización de datos
Control de acceso por rutas
--
## Despliegue
Backend desplegado en Railway
Frontend desplegado en Vercel

Aquí tienes la sección de **Capturas de Pantalla usando tablas**, organizada y más visual para un README:

---

## Capturas de Pantalla

### Contactos

| Vista | Imagen |
|------|--------|
| Lista de contactos | ![contactos1](https://github.com/user-attachments/assets/755e32e2-787a-4baa-adeb-eced6aba456a) |
| Detalle de contactos | ![contactos2](https://github.com/user-attachments/assets/3066bad1-9e91-40d5-8ae1-cd0a36d739f5) |

---

### Chats en tiempo real

| Vista | Imagen |
|------|--------|
| Conversación activa | ![chat2](https://github.com/user-attachments/assets/70c0e764-47a0-4023-a88e-4c16c27731e6) |
| Mensajería en vivo | ![chat3](https://github.com/user-attachments/assets/c7def236-daab-4507-81f3-d9dadd0ae495) |
| Chat con usuario | ![chat4](https://github.com/user-attachments/assets/6a5495d5-46f8-4eae-975f-fbcd20fb85e7) |

---

### Eventos de escritura en vivo

| Vista | Imagen |
|------|--------|
| Indicador de escritura 1 | ![typing1](https://github.com/user-attachments/assets/eee07e0a-b0dc-4c57-b04b-faefd1d293f6) |
| Estado de chat activo | ![typing3](https://github.com/user-attachments/assets/546808f9-3800-4fdc-94f9-00a0a608898c) |



---

### Filtros

| Vista | Imagen |
|------|--------|
| Filtros activos | ![filter1](https://github.com/user-attachments/assets/a88bfc5a-327a-46c7-9a79-723ea1acdec7) |
| Búsqueda y filtrado | ![filter2](https://github.com/user-attachments/assets/b7af9502-358a-4f59-a4cb-55384f527358) |


---




