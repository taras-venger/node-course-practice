import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

@Exclude()
export class MonitorBody {
  @Expose()
  @IsNumber()
  public id: number;

  @Expose()
  @IsString()
  public name: string;
}
