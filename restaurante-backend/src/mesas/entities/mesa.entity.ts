import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoMesa } from './estado-mesa.enum';

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: number;

  @Column()
  capacidad: number;

  @Column({
    type: 'text',
    enum: EstadoMesa,
    default: EstadoMesa.DISPONIBLE,
  })
  estado: EstadoMesa;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
