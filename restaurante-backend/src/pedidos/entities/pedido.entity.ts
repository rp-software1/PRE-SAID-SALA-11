import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mesa } from '../../mesas/entities/mesa.entity';
import { Plato } from '../../platos/entities/plato.entity';
import { EstadoPedido } from './estado-pedido.enum';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Mesa, { nullable: false })
  @JoinColumn({ name: 'mesaId' })
  mesa: Mesa;

  @ManyToMany(() => Plato)
  @JoinTable({ name: 'pedido_platos' })
  platos: Plato[];

  @Column({
    type: 'text',
    enum: EstadoPedido,
    default: EstadoPedido.PENDIENTE,
  })
  estado: EstadoPedido;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
