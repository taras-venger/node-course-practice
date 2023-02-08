import { Exclude, Expose } from 'class-transformer';
import { IsLatitude, IsLongitude, IsString } from 'class-validator';

@Exclude()
export class SiteView {
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
}
