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
import { ActualizarMesaDto } from './dto/actualizar-mesa.dto';
import { CambiarEstadoMesaDto } from './dto/cambiar-estado-mesa.dto';
import { CrearMesaDto } from './dto/crear-mesa.dto';
import { Mesa } from './entities/mesa.entity';
import { MesasService } from './mesas.service';

@Controller('mesas')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  crear(@Body() crearMesaDto: CrearMesaDto): Promise<Mesa> {
    return this.mesasService.crear(crearMesaDto);
  }

  @Get()
  encontrarTodos(): Promise<Mesa[]> {
    return this.mesasService.encontrarTodos();
  }

  @Get(':id')
  encontrarUno(@Param('id', ParseIntPipe) id: number): Promise<Mesa> {
    return this.mesasService.encontrarUno(id);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() cambiarEstadoDto: CambiarEstadoMesaDto,
  ): Promise<Mesa> {
    return this.mesasService.cambiarEstado(id, cambiarEstadoDto.estado);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarMesaDto: ActualizarMesaDto,
  ): Promise<Mesa> {
    return this.mesasService.actualizar(id, actualizarMesaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.mesasService.eliminar(id);
  }
}
