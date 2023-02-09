import { Numeric } from '@panenco/papi';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class MonitorView {
  @Expose()
  @Numeric()
  public id: number;

  @Expose()
  @IsString()
  public name: string;
}
