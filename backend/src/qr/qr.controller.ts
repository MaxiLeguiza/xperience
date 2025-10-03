import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { QrService } from './qr.service';
import { CreateQrDto } from './create-qr.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

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
}
