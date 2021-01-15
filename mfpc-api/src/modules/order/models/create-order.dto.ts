import { Type } from 'class-transformer';
import { ArrayMinSize, IsNumber, IsOptional, IsString, Length, Min, ValidateNested } from 'class-validator';

export class ProductDto {
  @IsString()
  @Length(24, 24)
  _id: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @Type(() => ProductDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  products: ProductDto[];

  @IsOptional()
  @IsString()
  discountCode?: string;
}
