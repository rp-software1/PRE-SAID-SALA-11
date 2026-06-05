import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

export class CrearPedidoDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  mesaId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsNotEmpty()
  platoIds: number[];
}
