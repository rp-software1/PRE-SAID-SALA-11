import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class PedidoItemDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  platoId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  cantidad: number;
}

export class CrearPedidoDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  mesaId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  items: PedidoItemDto[];
}
