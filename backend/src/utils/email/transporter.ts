import nodemailer from "nodemailer";
import enviromentVariables from "../envVariables";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: enviromentVariables.EMAIL_USER,
    pass: enviromentVariables.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: enviromentVariables.MAIL_TLS_REJECT_UNAUTHORIZED,
  },
});

<<<<<<< HEAD
// Verificación solo en producción
if (process.env.NODE_ENV === 'production') {
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Error en la configuración de correo:', error.message);
    } else {
      console.log('✅ Servidor de correo listo para enviar');
=======
// Evita bloquear el arranque del backend por problemas SMTP en desarrollo.
if (enviromentVariables.MAIL_VERIFY_ON_BOOT) {
  transporter.verify((error) => {
    if (error) {
      console.log('Error en la configuracion de correo:', error.message);
    } else {
      console.log('Servidor de correo listo para enviar');
>>>>>>> 451ac5e6658109e4d7979ea01aa213003018e42f
    }
  });
}

export default transporter;
