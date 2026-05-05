import { Controller, Post, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

class CreatePaymentDto {
  items: any[];
  payer: { name: string; surname: string; email: string; };
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

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
