import { BadRequestException, ConflictException, GoneException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Qr } from './qr.entity';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
// import * as qrcodeTerminal from 'qrcode-terminal'

@Injectable()
export class QrService {
  constructor(
    @InjectModel(Qr.name)
    private readonly qrModel: Model<Qr>,
  ) {}

  // 🔹 Generar y guardar QR
  async createQr(data: { recorridoId: string; idUser: string; email?: string }) {
    const qrData = {
      recorridoId: data.recorridoId,
      userId: data.idUser,
      email: data.email, // opcional
    };

    console.log("este es el data del qr", qrData);

    // const qrContent = `http://localhost:3000/recorrido/${data.recorridoId}`;

    const qrContent = JSON.stringify(qrData);

    const qrBase64 = await QRCode.toDataURL(qrContent);
    // qrcodeTerminal.generate(qrContent, { small: true }); // consola

    // Guardar en DB
    const newQr = new this.qrModel({
      recorridoId: data.recorridoId,
      qr: qrBase64,
    });
    return newQr.save();
  }

  async getQrList() {
    return this.qrModel.find();
  }

  async getQrById(id: string) {
    return this.qrModel.findById(id);
  }

  async validateQr(content: string, currentUserId?: string) {
    if (!content) throw new BadRequestException('Falta contenido del QR');

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new BadRequestException('Contenido de QR inválido (no es JSON)');
    }

    const { recorridoId, userId, email } = parsed || {};
    if (!recorridoId) {
      throw new BadRequestException('El QR no tiene recorridoId');
    }

    // Buscamos el QR emitido para ese recorrido
    const qrDoc = await this.qrModel.findOne({ recorridoId });
    if (!qrDoc) {
      throw new NotFoundException('QR no registrado en el sistema');
    }

    if (qrDoc.used) {
      throw new ConflictException('QR ya fue utilizado');
    }

    // Marcamos como usado (anti-reuso básico)
    qrDoc.used = true;
    qrDoc.usedAt = new Date();
    qrDoc.usedBy = currentUserId ?? userId ?? null;
    await qrDoc.save();

    return {
      ok: true,
      recorridoId,
      userId: qrDoc.usedBy,
      email: email ?? null,
      usedAt: qrDoc.usedAt,
    };
  }
}
