import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';

interface Item {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
}

@Injectable()
export class PaymentsService {
  private client: MercadoPagoConfig;

  constructor(private configService: ConfigService) {
    const accessToken = this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN no está definido');
    }
    this.client = new MercadoPagoConfig({ accessToken });
  }

  async createPreference(items: Item[], payer: any) {
    try {
      const preference = new Preference(this.client);
      const body = {
        items: items,
        payer: { name: payer.name, surname: payer.surname, email: payer.email },
        back_urls: {
          // Estas URLs apuntan al FRONTEND de la aplicación
          success: 'http://localhost:5173/compra-exito',// Localhos:5173
          failure: 'http://localhost:5173/compra-fallida',
          pending: 'http://localhost:5173/compra-pendiente',
        },
       /* auto_return: 'approved' as const,*/
        // Esta URL apunta a ESTE microservicio
        notification_url: 'https://localhost:5173/payments/webhook', // Me recomienda utilizar un ngrok para esto: Sirve para exponer un servidor local a Internet de forma segura y temporal
      };

      const result = await preference.create({ body });
      return { id: result.id, init_point: result.init_point };

    } catch (error) {
      console.error('Error al crear la preferencia:', error.response?.data || error.message);
      throw new InternalServerErrorException('Error al crear la preferencia de pago');
    }
  }
}