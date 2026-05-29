import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ActualizarPlatoDto } from './dto/actualizar-plato.dto';
import { CrearPlatoDto } from './dto/crear-plato.dto';
import { Plato } from './entities/plato.entity';
import { PlatosService } from './platos.service';

@Controller('platos')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class PlatosController {
  constructor(private readonly platosService: PlatosService) {}

  @Post()
  crear(@Body() crearPlatoDto: CrearPlatoDto): Promise<Plato> {
    return this.platosService.crear(crearPlatoDto);
  }

  @Get()
  encontrarTodos(): Promise<Plato[]> {
    return this.platosService.encontrarTodos();
  }

  @Get(':id')
  encontrarUno(@Param('id', ParseIntPipe) id: number): Promise<Plato> {
    return this.platosService.encontrarUno(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarPlatoDto: ActualizarPlatoDto,
  ): Promise<Plato> {
    return this.platosService.actualizar(id, actualizarPlatoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.platosService.eliminar(id);
  }
}
