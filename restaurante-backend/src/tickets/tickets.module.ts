import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { Mesa } from '../mesas/entities/mesa.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { MesasModule } from '../mesas/mesas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Mesa, Pedido]), forwardRef(() => MesasModule)],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
