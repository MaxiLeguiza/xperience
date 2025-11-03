import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { RecorridoService } from "./recorrido.service";
import { CreateRecorridoDto } from "./dto/create-recorrido.dto";
import { UpdateRecorridoDto } from "./dto/update-recorrido.dto";

@Controller("recorrido")
export class RecorridoController {
  constructor(private readonly recorridoService: RecorridoService) {}

  @Post()
  create(@Body() createRecorridoDto: CreateRecorridoDto) {
    return this.recorridoService.create(createRecorridoDto);
  }

  @Get()
  findAll() {
    return this.recorridoService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.recorridoService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRecorridoDto: UpdateRecorridoDto) {
    return this.recorridoService.update(id, updateRecorridoDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.recorridoService.remove(id);
  }
}