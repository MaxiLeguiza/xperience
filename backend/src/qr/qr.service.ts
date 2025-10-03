import { Injectable } from '@nestjs/common';
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

    // Generar string QR en base64 (para frontend) o terminal
    const qrBase64 = await QRCode.toDataURL(qrContent);
    // qrcodeTerminal.generate(qrContent, { small: true }); // consola

    // Guardar en DB
    const newQr = new this.qrModel({
      recorridoId: data.recorridoId,
      qr: qrBase64,
    });
    return newQr.save();
  }

  // 🔹 Obtener todos los QR guardados
  async getQrList() {
    return this.qrModel.find();
  }

  // 🔹 Buscar un QR por id
  async getQrById(id: string) {
    return this.qrModel.findById(id);
  }
}
