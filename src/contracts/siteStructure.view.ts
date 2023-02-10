import { Nested } from '@panenco/papi';
import { Exclude, Expose } from 'class-transformer';
import { IsLatitude, IsLongitude, IsString } from 'class-validator';
import { AirspaceView } from './airspace.view';

@Exclude()
export class SiteStructureView {
  @Expose()
  @IsString()
  public id: string;

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
  @Nested(AirspaceView, true)
  public airspaces: AirspaceView[];
}
