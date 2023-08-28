import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class QueryPoolDto {
  @IsString()
  @Length(42)
  @IsOptional()
  nft_address?: string;

  @IsString()
  @Length(42)
  @IsOptional()
  owner?: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
