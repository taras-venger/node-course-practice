import { Nested } from '@panenco/papi';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsLatitude, IsLongitude, IsOptional } from 'class-validator';
import { AirspaceBody } from './airspace.body';

@Exclude()
export class SiteBody {
  @Expose()
  @IsOptional()
  public id?: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public country: string;

  @Expose()
  @IsString()
  public city: string;

  @Expose()
  @IsLatitude()
  public latitude: number;

  @Expose()
  @IsLongitude()
  public longitude: number;

  @Expose()
  @Nested(AirspaceBody, true)
  public airspaces: AirspaceBody[];
}
