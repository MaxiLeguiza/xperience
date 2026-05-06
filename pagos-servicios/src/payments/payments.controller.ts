import { Controller, Post, Body, HttpCode, HttpStatus, Query, Get, Redirect, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ConfigService } from '@nestjs/config';

class CreatePaymentDto {
  items!: any[];
  payer!: { name: string; surname: string; email: string; };
}

class ConnectPaymentDto {
  accessToken!: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/status')
  @HttpCode(HttpStatus.OK)
  async getStatus() {
    return this.paymentsService.getMerchantProfile();
  }

  @Get('/oauth/authorize')
  @HttpCode(HttpStatus.OK)
  getOAuthAuthorizationUrl() {
    const url = this.paymentsService.getOAuthAuthorizationUrl();
    return { url };
  }

  @Get('/oauth/callback')
  @Redirect()
  async handleOAuthCallback(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('Código de autorización faltante');
    }

    await this.paymentsService.handleOAuthCallback(code);
    const frontendRedirect =
      this.configService.get<string>('FRONTEND_OAUTH_REDIRECT') ||
      'http://localhost:5173/checkout';

    return { url: `${frontendRedirect}?mp_connected=1` };
  }

  @Post('/connect')
  @HttpCode(HttpStatus.OK)
  async connect(@Body() body: ConnectPaymentDto) {
    return this.paymentsService.connectToken(body.accessToken);
  }

  @Post('/create-preference')
  @HttpCode(HttpStatus.CREATED)
  async createPreference(@Body() body: CreatePaymentDto) {
    return this.paymentsService.createPreference(body.items, body.payer);
  }

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  receiveWebhook(@Body() data: any, @Query() query: any) {
    console.log('--- Webhook de Pagos Recibido ---');
    console.log('Query:', query);
    console.log('Body:', data);

    /* Lógica para actualizar la DB (idealmente, este servicio
     notificaría al backend principal vía HTTp )*/

    return { received: true };
  }
}
