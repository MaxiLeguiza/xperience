import nodemailer from "nodemailer";
import enviromentVariables from "../envVariables";

const transporter = nodemailer.createTransport({
  service: 'gmail', // Usar 'service' es mejor para Gmail en Nodemailer
  // Por el momento, hasta que nos brinden acceso al hosting y configurar SMTP
  // host: 'smtp.gmail.com',
  // secure:false,
  auth: {
    user: enviromentVariables.EMAIL_USER,
    pass: enviromentVariables.EMAIL_PASS,
  },
});

// Descomenta esto para que en cuanto prendas el servidor, 
// la terminal te diga si la conexión es exitosa o no.
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Error en la configuración de correo:', error.message);
  } else {
    console.log('✅ Servidor de correo listo para enviar');
  }
});

export default transporter;
