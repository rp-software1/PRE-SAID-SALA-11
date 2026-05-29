import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Plato } from './platos/entities/plato.entity';
import { PlatosModule } from './platos/platos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(process.cwd(), 'db.sqlite'),
      entities: [Plato],
      synchronize: true,
    }),
    PlatosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
