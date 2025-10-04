import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { QrService } from './qr.service';
import { CreateQrDto } from './create-qr.dto';
import { JwtAuthGuard } from 'src/user/auth.guard';
import { RedeemQrDto } from './redeem-qr.dto';

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get()
  findAllQr() {
    return this.qrService.getQrList();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  saveQr(@Req() req: AuthRequest, @Body() body: CreateQrDto) {
    //any
    const { recorridoId } = body;
    const idUser = req.user.id;
    const email = req.user.email;
    const data = { recorridoId, idUser, email };
    return this.qrService.createQr(data);
  }

  // El front envía el token leído del QR
  @Post('validate')
  async validate(@Body() body: { content: string }, @Req() req: any) {
    // si tenés login con JWT podés extraer req.user?.id, pero es opcional
    const currentUserId = req?.user?.id;
    return this.qrService.validateQr(body.content, currentUserId);
  }
}
