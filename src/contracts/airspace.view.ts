import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class AirspaceView {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public name: string;
}
