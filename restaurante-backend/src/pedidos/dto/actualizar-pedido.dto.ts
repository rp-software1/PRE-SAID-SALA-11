import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { PedidoItemDto } from './crear-pedido.dto';

export class ActualizarPedidoDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  mesaId?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  items?: PedidoItemDto[];
}
