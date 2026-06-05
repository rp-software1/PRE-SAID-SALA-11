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
import { ActualizarPedidoDto } from './dto/actualizar-pedido.dto';
import { CambiarEstadoPedidoDto } from './dto/cambiar-estado-pedido.dto';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { Pedido } from './entities/pedido.entity';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  crear(@Body() crearPedidoDto: CrearPedidoDto): Promise<Pedido> {
    return this.pedidosService.crear(crearPedidoDto);
  }

  @Get()
  encontrarTodos(): Promise<Pedido[]> {
    return this.pedidosService.encontrarTodos();
  }

  @Get(':id')
  encontrarUno(@Param('id', ParseIntPipe) id: number): Promise<Pedido> {
    return this.pedidosService.encontrarUno(id);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() cambiarEstadoDto: CambiarEstadoPedidoDto,
  ): Promise<Pedido> {
    return this.pedidosService.cambiarEstado(id, cambiarEstadoDto.estado);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarPedidoDto: ActualizarPedidoDto,
  ): Promise<Pedido> {
    return this.pedidosService.actualizar(id, actualizarPedidoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pedidosService.eliminar(id);
  }
}
