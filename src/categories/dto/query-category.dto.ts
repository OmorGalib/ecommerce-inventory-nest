import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryCategoryDto {
  @ApiProperty({
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @ApiProperty({
    required: false,
    description: 'Search term for category name or description',
    example: 'electronics',
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({
    required: false,
    description: 'Sort field (name, createdAt, etc.)',
    example: 'name',
  })
  @IsOptional()
  @IsString()
  sortBy: string = 'name';

  @ApiProperty({
    required: false,
    description: 'Sort order (ASC or DESC)',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  sortOrder: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    required: false,
    description: 'Filter by minimum product count',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minProducts: number;

  @ApiProperty({
    required: false,
    description: 'Filter by maximum product count',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxProducts: number;
}