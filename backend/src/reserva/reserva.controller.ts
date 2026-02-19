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
    console.log(req.user); // <--- Vamos a ver qué trae el token realmente
    console.log('-----------------------------');

    const userEmail = req.user?.email;

    return this.reservaService.create(createReservaDto, userEmail);
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
