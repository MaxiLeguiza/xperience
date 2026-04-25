import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

type ReservaEmailData = {
  to: string;
  nombre: string;
  apellido?: string;
  fecha: Date;
  items: Array<{ nombre: string; precio: string; capacidad?: number }>;
  total: number;
  paymentMethod?: string;
  cantidadPersonas?: number;
  descuento?: number;
  emailAgencia?: string;
  notas?: string;
  reservaId?: string;
  telefono?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter?: Transporter;
  private readonly from?: string;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('GMAIL_USER');
    const pass = this.configService.get<string>('GMAIL_APP_PASSWORD');
    const rejectUnauthorized =
      this.configService.get<string>('MAIL_TLS_REJECT_UNAUTHORIZED') !==
      'false';

    this.from = this.configService.get<string>('MAIL_FROM') || user;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
        tls: { rejectUnauthorized },
      });
    }
  }

  async sendReservationEmail(data: ReservaEmailData) {
    if (!this.transporter || !this.from) {
      this.logger.warn(
        'Email no configurado: faltan GMAIL_USER/GMAIL_APP_PASSWORD.',
      );
      return;
    }

    const itemsText =
      data.items?.length > 0
        ? data.items
            .map((i) => `- ${i.nombre} (${i.precio})${i.capacidad ? ` x ${i.capacidad}` : ''}`)
            .join('\n')
        : '- (sin items)';

    const itemsHtml =
      data.items?.length > 0
        ? data.items
            .map(
              (i) =>
                `<li><strong>${i.nombre}</strong> <span>${i.precio}</span>${i.capacidad ? ` <span>x ${i.capacidad}</span>` : ''}</li>`,
            )
            .join('')
        : '<li>(sin items)</li>';

    const fecha = new Date(data.fecha).toLocaleDateString('es-AR');
    const nombreCompleto = [data.nombre, data.apellido].filter(Boolean).join(' ');

    const subject = 'Confirmacion de reserva - Xperience';
    const text = `Hola ${nombreCompleto || data.nombre},

Tu reserva fue registrada correctamente.

Codigo de reserva: ${data.reservaId ?? 'Se asignara al confirmar'}
Fecha: ${fecha}
Metodo de pago: ${data.paymentMethod || 'credito'}
Cantidad de personas: ${data.cantidadPersonas ?? 'No informada'}
Descuento: $${data.descuento ?? 0}
Email de agencia: ${data.emailAgencia || 'No informado'}
Telefono: ${data.telefono || 'No informado'}
Notas: ${data.notas || 'Sin notas adicionales'}
Items:
${itemsText}

Total: $${data.total}

Gracias por elegir Xperience.`;

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h2>Confirmacion de reserva</h2>
        <p>Hola <strong>${nombreCompleto || data.nombre}</strong>, tu reserva fue registrada correctamente.</p>
        <p><strong>Codigo de reserva:</strong> ${data.reservaId ?? 'Se asignara al confirmar'}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Metodo de pago:</strong> ${data.paymentMethod || 'credito'}</p>
        <p><strong>Cantidad de personas:</strong> ${data.cantidadPersonas ?? 'No informada'}</p>
        <p><strong>Descuento:</strong> $${data.descuento ?? 0}</p>
        <p><strong>Email de agencia:</strong> ${data.emailAgencia || 'No informado'}</p>
        <p><strong>Telefono:</strong> ${data.telefono || 'No informado'}</p>
        <p><strong>Notas:</strong> ${data.notas || 'Sin notas adicionales'}</p>
        <p><strong>Items:</strong></p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total:</strong> $${data.total}</p>
        <p>Gracias por elegir Xperience.</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: this.from,
      to: data.to,
      subject,
      text,
      html,
    });
  }
}
