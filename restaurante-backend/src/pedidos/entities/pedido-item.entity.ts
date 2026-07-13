import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plato } from '../../platos/entities/plato.entity';
import { Pedido } from './pedido.entity';

@Entity('pedido_items')
export class PedidoItem {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 2 })
  @Column()
  cantidad: number;

  @ApiProperty({ example: 25.5 })
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;

  @Column()
  pedidoId: number;

  @ApiProperty({ type: () => Plato })
  @ManyToOne(() => Plato)
  @JoinColumn({ name: 'platoId' })
  plato: Plato;

  @Column()
  platoId: number;
}
