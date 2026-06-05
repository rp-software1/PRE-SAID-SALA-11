import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Mesa } from './mesas/entities/mesa.entity';
import { MesasModule } from './mesas/mesas.module';
import { Pedido } from './pedidos/entities/pedido.entity';
import { PedidosModule } from './pedidos/pedidos.module';
import { Plato } from './platos/entities/plato.entity';
import { PlatosModule } from './platos/platos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(process.cwd(), 'db.sqlite'),
      entities: [Plato, Mesa, Pedido],
      synchronize: true,
    }),
    PlatosModule,
    MesasModule,
    PedidosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
