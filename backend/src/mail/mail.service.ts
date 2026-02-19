import { Injectable, InternalServerErrorException } from '@nestjs/common';
import transporter from '../utils/email/transporter';
import enviromentVariables from '../utils/envVariables';

@Injectable()
export class MailService {
  async sendReservationConfirm(email: string, reserva: any) {
    try {
      await transporter.sendMail({
        from: enviromentVariables.EMAIL_USER,
        to: email,
        subject: 'Confirmación de Reserva',
        html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
          <h1 style="color: #2c3e50;">¡Reserva Confirmada en Xperience!</h1>
          <p>Gracias por tu reserva. Aquí tienes los detalles:</p>
          <ul>
            <li><strong>Descripción:</strong> ${reserva.descripcion}</li>
            <li><strong>Fecha de Llegada:</strong> ${reserva.fechaLlegada}</li>
            <li><strong>Personas:</strong> ${reserva.cantidadPersonas}</li>
            <li><strong>Código de Seguimiento:</strong> <span style="color: blue;">${reserva._id}</span></li>
          </ul>
          <p>¡Te esperamos!</p>
        </div>
      `,
      });
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Error al enviar email');
    }
  }
}
