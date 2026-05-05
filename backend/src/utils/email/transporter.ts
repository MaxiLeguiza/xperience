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

// Evita bloquear el arranque del backend por problemas SMTP en desarrollo.
if (enviromentVariables.MAIL_VERIFY_ON_BOOT) {
  transporter.verify((error) => {
    if (error) {
      console.log('Error en la configuracion de correo:', error.message);
    } else {
      console.log('Servidor de correo listo para enviar');
    }
  });
}

export default transporter;
