import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { PagarTicketDto } from './dto/pagar-ticket.dto';
import { Mesa } from '../mesas/entities/mesa.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { EstadoTicket } from './entities/estado-ticket.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const mesa = await this.mesaRepository.findOne({
      where: { id: createTicketDto.mesaId },
    });

    if (!mesa) {
      throw new NotFoundException(
        `Mesa con ID ${createTicketDto.mesaId} no encontrada`,
      );
    }

    const pedidos = await this.pedidoRepository.find({
      where: { mesa: { id: mesa.id } },
    });

    if (pedidos.length === 0) {
      throw new BadRequestException(
        `La mesa con ID ${mesa.id} no tiene pedidos`,
      );
    }

    const total = pedidos.reduce(
      (acc, pedido) => acc + Number(pedido.total),
      0,
    );

    const newTicket = this.ticketRepository.create({
      mesa,
      total,
    });

    return this.ticketRepository.save(newTicket);
  }

  async findOne(id: number): Promise<any> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: { mesa: true },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    }

    const pedidos = await this.pedidoRepository.find({
      where: { mesa: { id: ticket.mesa.id } },
    });

    return {
      ...ticket,
      pedidos,
    };
  }

  async pagar(id: number, pagarTicketDto: PagarTicketDto): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    }

    ticket.estado = EstadoTicket.PAGADO;
    ticket.metodoPago = pagarTicketDto.metodoPago;

    return this.ticketRepository.save(ticket);
  }
}
