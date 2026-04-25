import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { CreateReservaEfectivoDto } from './dto/create-reserva-efectivo.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { JwtAuthGuard } from 'src/user/auth.guard';

@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // <--- AQUÍ UNES EL GUARD
  create(@Body() createReservaDto: CreateReservaDto, @Req() req: any) {
    // El Guard valida el token y mete los datos del usuario en 'req.user'
    console.log('--- CONTENIDO DE REQ.USER ---');
    console.log(req.user);
    console.log('-----------------------------');

    const userEmail = req.user?.email;
    const dtoWithUser = { ...createReservaDto, user: userEmail }; // ajustar clave "user" si tu esquema usa otra

    return this.reservaService.create(dtoWithUser);
  }

  @Post('public/efectivo')
  // NO REQUIERE AUTENTICACIÓN - Para reservas de pago en efectivo
  createReservaEfectivo(@Body() createReservaEfectivoDto: CreateReservaEfectivoDto) {
    console.log('--- NUEVA RESERVA EFECTIVO (SIN AUTENTICACIÓN) ---');
    console.log(createReservaEfectivoDto);
    console.log('-------------------------------------------------');

    return this.reservaService.createReservaEfectivo(createReservaEfectivoDto);
  }

  @Get()
  findAll() {
    return this.reservaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservaService.update(id, updateReservaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservaService.remove(id);
  }
}
// ...existing code...
