import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

@Exclude()
export class SearchQuery {
  @Expose()
  @IsString()
  @IsOptional()
  public search?: string;
}
