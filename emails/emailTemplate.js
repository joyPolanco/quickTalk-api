export function createWelcomeEmailTemplate(fullName, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Quick Talk</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff8f0;">
    
    <div style="background: linear-gradient(to right, #FF7E5F, #FEB47B); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img src="https://img.freepik.com/free-vector/chat-message-icon-cute-style_53876-13843.jpg?w=740&t=st=1741295028~exp=1741298628~hmac=example" alt="Quick Talk Logo" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: white; padding: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">¡Bienvenido a Quick Talk!</h1>
    </div>
    
    <div style="background-color: #fff4e6; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #FF7E5F;"><strong>Hola ${fullName},</strong></p>
      <p>Nos alegra que te unas a Quick Talk, la app que conecta con amigos, familiares y colegas en tiempo real, de manera fácil y divertida.</p>
      
      <div style="background-color: #fff1e6; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #FF7E5F;">
        <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>Comienza en solo unos pasos:</strong></p>
        <ul style="padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 10px;">Configura tu foto de perfil</li>
          <li style="margin-bottom: 10px;">Agrega tus contactos</li>
          <li style="margin-bottom: 10px;">Inicia tu primera conversación</li>
          <li style="margin-bottom: 0;">Comparte fotos, videos y más</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${clientURL}" style="background: linear-gradient(to right, #FF7E5F, #FEB47B); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">Abrir Quick Talk</a>
      </div>
      
      <p style="margin-bottom: 5px;">Si necesitas ayuda o tienes preguntas, siempre estamos aquí para asistirte.</p>
      <p style="margin-top: 0;">¡Disfruta chateando!</p>
      
      <p style="margin-top: 25px; margin-bottom: 0;">Saludos cordiales,<br>El equipo de Quick Talk</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2025 Quick Talk. Todos los derechos reservados.</p>
      <p>
        <a href="#" style="color: #FF7E5F; text-decoration: none; margin: 0 10px;">Política de Privacidad</a>
        <a href="#" style="color: #FF7E5F; text-decoration: none; margin: 0 10px;">Términos de Servicio</a>
        <a href="#" style="color: #FF7E5F; text-decoration: none; margin: 0 10px;">Contáctanos</a>
      </p>
    </div>
    
  </body>
  </html>
  `;
}