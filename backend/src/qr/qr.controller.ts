import {
  Body,
  Controller,
  Get,
  Post,
  Req /*, UseGuards*/,
} from '@nestjs/common';
import { QrService } from './qr.service';
import { CreateQrDto } from './create-qr.dto';
// import { JwtAuthGuard } from 'src/user/auth.guard';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get()
  findAllQr() {
    return this.qrService.getQrList();
  }

  @Post()
  // @UseGuards(JwtAuthGuard)   // ⬅️ DESACTIVADO TEMPORALMENTE
  async saveQr(@Req() req: AuthRequest, @Body() body: CreateQrDto) {
    const { recorridoId } = body;
    const idUser = (req as any)?.user?.id ?? 'anon';
    const email = (req as any)?.user?.email ?? null;
    return this.qrService.createQr({ recorridoId, idUser, email });
  }

  @Post('validate')
  async validate(@Body() body: { content: string }, @Req() req: any) {
    const currentUserId = req?.user?.id;
    return this.qrService.validateQr(body.content, currentUserId);
  }
}
