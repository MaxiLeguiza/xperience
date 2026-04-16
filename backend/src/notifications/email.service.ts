import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

type ReservaEmailData = {
  to: string;
  nombre: string;
  fecha: Date;
  items: Array<{ nombre: string; precio: string; capacidad?: number }>;
  total: number;
  paymentMethod?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter?: Transporter;
  private readonly from?: string;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('GMAIL_USER');
    const pass = this.configService.get<string>('GMAIL_APP_PASSWORD');
    this.from = this.configService.get<string>('MAIL_FROM') || user;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    }
  }

  async sendReservationEmail(data: ReservaEmailData) {
    if (!this.transporter || !this.from) {
      this.logger.warn('Email no configurado: faltan GMAIL_USER/GMAIL_APP_PASSWORD.');
      return;
    }

    const itemsText =
      data.items?.length > 0
        ? data.items.map((i) => `- ${i.nombre} (${i.precio})`).join('\n')
        : '- (sin items)';

    const itemsHtml =
      data.items?.length > 0
        ? data.items
            .map(
              (i) =>
                `<li><strong>${i.nombre}</strong> <span>${i.precio}</span></li>`,
            )
            .join('')
        : '<li>(sin items)</li>';

    const fecha = new Date(data.fecha).toLocaleDateString('es-AR');

    const subject = 'Confirmacion de reserva - Xperience';
    const text = `Hola ${data.nombre},

Tu reserva fue registrada correctamente.

Fecha: ${fecha}
Metodo de pago: ${data.paymentMethod || 'credito'}
Items:
${itemsText}

Total: $${data.total}

Gracias por elegir Xperience.`;

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h2>Confirmacion de reserva</h2>
        <p>Hola <strong>${data.nombre}</strong>, tu reserva fue registrada correctamente.</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Metodo de pago:</strong> ${data.paymentMethod || 'credito'}</p>
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
