import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Mesa } from '../mesas/entities/mesa.entity';
import { Plato } from '../platos/entities/plato.entity';
import { ActualizarPedidoDto } from './dto/actualizar-pedido.dto';
import { CrearPedidoDto, PedidoItemDto } from './dto/crear-pedido.dto';
import { EstadoPedido } from './entities/estado-pedido.enum';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';

@Injectable()
export class PedidosService {
  private readonly relaciones = { relations: { mesa: true, items: { plato: true } } };

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidosRepository: Repository<Pedido>,
    @InjectRepository(PedidoItem)
    private readonly pedidoItemsRepository: Repository<PedidoItem>,
    @InjectRepository(Mesa)
    private readonly mesasRepository: Repository<Mesa>,
    @InjectRepository(Plato)
    private readonly platosRepository: Repository<Plato>,
  ) {}

  async crear(crearPedidoDto: CrearPedidoDto): Promise<Pedido> {
    const mesa = await this.validarMesa(crearPedidoDto.mesaId);
    
    const itemsProcesados = await this.validarYProcesarItems(crearPedidoDto.items);
    const total = itemsProcesados.reduce((suma, item) => suma + item.subtotal, 0);

    const pedido = this.pedidosRepository.create({
      mesa,
      items: itemsProcesados,
      total,
      estado: EstadoPedido.PENDIENTE,
    });
    
    const guardado = await this.pedidosRepository.save(pedido);
    return this.encontrarUno(guardado.id);
  }

  async encontrarTodos(): Promise<Pedido[]> {
    return this.pedidosRepository.find(this.relaciones);
  }

  async encontrarUno(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      ...this.relaciones,
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }
    return pedido;
  }

  async actualizar(
    id: number,
    actualizarPedidoDto: ActualizarPedidoDto,
  ): Promise<Pedido> {
    const pedido = await this.encontrarUno(id);

    if (actualizarPedidoDto.mesaId !== undefined) {
      pedido.mesa = await this.validarMesa(actualizarPedidoDto.mesaId);
    }

    if (actualizarPedidoDto.items !== undefined) {
      // Eliminar los items anteriores para evitar huérfanos
      await this.pedidoItemsRepository.delete({ pedidoId: id });
      
      const nuevosItems = await this.validarYProcesarItems(actualizarPedidoDto.items);
      pedido.items = nuevosItems;
      pedido.total = nuevosItems.reduce((suma, item) => suma + item.subtotal, 0);
    }

    await this.pedidosRepository.save(pedido);
    return this.encontrarUno(id);
  }

  async eliminar(id: number): Promise<void> {
    const pedido = await this.encontrarUno(id);
    await this.pedidosRepository.remove(pedido);
  }

  async cambiarEstado(id: number, nuevoEstado: EstadoPedido): Promise<Pedido> {
    const pedido = await this.encontrarUno(id);
    pedido.estado = nuevoEstado;
    await this.pedidosRepository.save(pedido);
    return this.encontrarUno(id);
  }

  private async validarMesa(mesaId: number): Promise<Mesa> {
    const mesa = await this.mesasRepository.findOne({ where: { id: mesaId } });
    if (!mesa) {
      throw new BadRequestException(`Mesa con id ${mesaId} no existe`);
    }
    return mesa;
  }

  private async validarYProcesarItems(itemsDto: PedidoItemDto[]) {
    const platoIds = itemsDto.map(item => item.platoId);
    const idsUnicos = [...new Set(platoIds)];
    
    const platosEncontrados = await this.platosRepository.find({
      where: { id: In(idsUnicos) },
    });
    
    const platosPorId = new Map(
      platosEncontrados.map((plato) => [plato.id, plato]),
    );
    
    const idsFaltantes = idsUnicos.filter((id) => !platosPorId.has(id));

    if (idsFaltantes.length > 0) {
      throw new BadRequestException(
        `Plato(s) con id ${idsFaltantes.join(', ')} no existe(n)`,
      );
    }

    return itemsDto.map((item) => {
      const plato = platosPorId.get(item.platoId)!;
      return this.pedidoItemsRepository.create({
        plato,
        cantidad: item.cantidad,
        subtotal: Number(plato.precio) * item.cantidad,
      });
    });
  }
}
