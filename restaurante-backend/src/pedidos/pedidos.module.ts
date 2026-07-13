import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from '../mesas/entities/mesa.entity';
import { MesasModule } from '../mesas/mesas.module';
import { Plato } from '../platos/entities/plato.entity';
import { PlatosModule } from '../platos/platos.module';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, PedidoItem, Mesa, Plato]),
    MesasModule,
    PlatosModule,
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
