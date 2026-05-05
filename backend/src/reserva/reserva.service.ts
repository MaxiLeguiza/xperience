import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { CreateReservaEfectivoDto } from './dto/create-reserva-efectivo.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationsService } from 'src/notifications/notifications.service';
import { EmailService } from 'src/notifications/email.service';

@Injectable()
export class ReservaService {
  constructor(
    @InjectModel(Reserva.name)
    private readonly reservaModel: Model<Reserva>,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  async create(createReservaDto: CreateReservaDto) {
    try {
      const reserva = await this.reservaModel.create(createReservaDto);

      // 1. Envía la notificación después de crear la reserva
      this.notificationsService.notifyNewReservation({
        message: '¡Nueva reserva registrada!',
        reservaId: reserva._id,
        email: reserva.email,
        items: reserva.items,
      });

      try {
        await this.emailService.sendReservationEmail({
          to: reserva.email,
          nombre: reserva.nombre,
          apellido: reserva.apellido,
          fecha: reserva.fecha,
          items: reserva.items || [],
          total: reserva.total,
          paymentMethod: reserva.paymentMethod,
          cantidadPersonas: reserva.cantidadPersonas,
          descuento: reserva.descuentoAplicado,
          emailAgencia: reserva.emailAgencia,
          notas: reserva.notas,
          reservaId: String(reserva._id),
          telefono: reserva.telefono,
        });
      } catch (emailError) {
        console.error('Error enviando correo de reserva:', emailError);
      }

      return reserva;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // Método específico para reservas de Efectivo sin autenticación
  async createReservaEfectivo(createReservaEfectivoDto: CreateReservaEfectivoDto) {
    try {
      // Crear objeto básico de reserva con los campos que el schema acepta
      const reservaData = {
        nombre: createReservaEfectivoDto.nombre,
        email: createReservaEfectivoDto.email,
        telefono: createReservaEfectivoDto.telefono,
        fecha: createReservaEfectivoDto.fecha,
        notas: createReservaEfectivoDto.notas || '',
        items: createReservaEfectivoDto.items,
        total: createReservaEfectivoDto.total,
        paymentMethod: createReservaEfectivoDto.metodoPago || 'efectivo',
        // Campos adicionales para reportes/análisis
        cantidadPersonas: createReservaEfectivoDto.cantidadPersonas,
        tourId: createReservaEfectivoDto.tourId,
        capacidadUtilizada: createReservaEfectivoDto.capacidadUtilizada,
        descuentoAplicado: createReservaEfectivoDto.descuentoAplicado,
        emailAgencia: createReservaEfectivoDto.emailAgencia,
        fechaReserva: createReservaEfectivoDto.fechaReserva,
      };

      const reserva = await this.reservaModel.create(reservaData);

      // 1. Envía la notificación después de crear la reserva
      this.notificationsService.notifyNewReservation({
        message: '¡Nueva reserva registrada - Pago en Efectivo!',
        reservaId: reserva._id,
        email: reserva.email,
        items: reserva.items,
      });

      // 2. Envía email de pre-confirmación con detalles de pago en efectivo
      try {
        await this.emailService.sendReservationEmail({
          to: reserva.email,
          nombre: reserva.nombre,
          apellido: reserva.apellido,
          fecha: reserva.fecha,
          items: reserva.items || [],
          total: reserva.total,
          paymentMethod: 'efectivo',
          cantidadPersonas: createReservaEfectivoDto.cantidadPersonas,
          descuento: createReservaEfectivoDto.descuentoAplicado,
          emailAgencia: createReservaEfectivoDto.emailAgencia,
          notas: reserva.notas,
          reservaId: String(reserva._id),
          telefono: reserva.telefono,
        });
      } catch (emailError) {
        console.error(
          'Error enviando correo de reserva en efectivo:',
          emailError,
        );
      }

      console.log('✅ Reserva de Efectivo creada exitosamente:', reserva._id);
      return {
        success: true,
        message: 'Reserva confirmada. Se enviará un correo de pre-confirmación.',
        reserva: reserva,
      };
    } catch (error) {
      console.error('❌ Error creando reserva de efectivo:', error);
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.reservaModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid reserva id: ${id}`);
    }
    const reserva = await this.reservaModel.findById(id);
    if (!reserva) {
      throw new NotFoundException(`Reserva with id ${id} not found`);
    }
    return reserva;
  }

  async update(id: string, updateReservaDto: UpdateReservaDto) {
    const reserva = await this.findOne(id);
    try {
      await reserva.updateOne(updateReservaDto, { new: true });
      return { ...reserva.toJSON(), ...updateReservaDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.reservaModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Reserva with id ${id} not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Reserva exists ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can't create Reserva - Check server logs`,
    );
  }
}
