import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, User, OAuth } from 'mercadopago';

interface Item {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
}

@Injectable()
export class PaymentsService {
  private client?: MercadoPagoConfig;
  private currentAccessToken?: string;

  constructor(private configService: ConfigService) {
    const accessToken = this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN');
    if (accessToken) {
      this.connectWithToken(accessToken);
    }
  }

  private connectWithToken(accessToken: string) {
    this.currentAccessToken = accessToken;
    this.client = new MercadoPagoConfig({ accessToken });
  }

  async getMerchantProfile() {
    if (!this.client) {
      return { connected: false, message: 'No hay una clave de Mercado Pago configurada.' };
    }

    try {
      const userClient = new User(this.client);
      const account = await userClient.get();
      return { connected: true, account };
    } catch (error) {
      const err = error as any;
      console.error('Error validando sesión de Mercado Pago:', err.response?.data || err.message || err);
      return { connected: false, message: 'No se pudo verificar Mercado Pago.' };
    }
  }

  async connectToken(accessToken: string) {
    try {
      const testClient = new MercadoPagoConfig({ accessToken });
      const userClient = new User(testClient);
      const account = await userClient.get();
      this.connectWithToken(accessToken);
      return { connected: true, account };
    } catch (error) {
      const err = error as any;
      console.error('Error conectando Mercado Pago:', err.response?.data || err.message || err);
      throw new InternalServerErrorException('No se pudo conectar con Mercado Pago. Revisa la clave de acceso.');
    }
  }

  getOAuthAuthorizationUrl() {
    const clientId = this.configService.get<string>('MERCADO_PAGO_CLIENT_ID');
    const redirectUri = this.configService.get<string>('MERCADO_PAGO_REDIRECT_URI');

    if (!clientId || !redirectUri) {
      throw new InternalServerErrorException('Configuración de OAuth incompleta.');
    }

    const baseUrl = 'https://auth.mercadopago.com.ar/authorization';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'read write offline_access',
      platform_id: 'MP',
      loginType: 'explicit',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  async handleOAuthCallback(code: string) {
    const clientId = this.configService.get<string>('MERCADO_PAGO_CLIENT_ID');
    const clientSecret = this.configService.get<string>('MERCADO_PAGO_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('MERCADO_PAGO_REDIRECT_URI');

    if (!clientId || !clientSecret || !redirectUri) {
      throw new InternalServerErrorException('Configuración de OAuth incompleta.');
    }

    try {
      const oAuthClient = new OAuth(new MercadoPagoConfig({ accessToken: 'dummy' }));
      const response = await oAuthClient.create({
        body: {
          client_secret: clientSecret,
          client_id: clientId,
          code,
          redirect_uri: redirectUri,
        },
      });

      const accessToken = response.access_token;
      if (accessToken) {
        this.connectWithToken(accessToken);
        return { success: true, access_token: accessToken };
      } else {
        throw new Error('No se recibió access token');
      }
    } catch (error) {
      const err = error as any;
      console.error('Error en OAuth callback:', err.response?.data || err.message || err);
      throw new InternalServerErrorException('Error procesando la autorización de Mercado Pago.');
    }
  }

  async createPreference(items: Item[], payer: any) {
    if (!this.client) {
      throw new InternalServerErrorException('Mercado Pago no está conectado.');
    }

    try {
      const preference = new Preference(this.client);
      const serviceUrl =
        this.configService.get<string>('PAYMENTS_SERVICE_URL') ||
        `http://localhost:${this.configService.get<string>('PAYMENTS_SERVICE_PORT') || '3002'}`;

      const body = {
        items: items,
        payer: { name: payer.name, surname: payer.surname, email: payer.email },
        payment_methods: {
          installments: 12,
          default_installments: 1,
        },
        back_urls: {
          success: 'http://localhost:5173/compra-exito',
          failure: 'http://localhost:5173/compra-fallida',
          pending: 'http://localhost:5173/compra-pendiente',
        },
        notification_url: `${serviceUrl}/payments/webhook`,
      };

      const result = await preference.create({ body });
      return { id: result.id, init_point: result.init_point };

    } catch (error) {
      const err = error as any;
      console.error('Error al crear la preferencia:', err.response?.data || err.message || err);
      throw new InternalServerErrorException('Error al crear la preferencia de pago');
    }
  }
}