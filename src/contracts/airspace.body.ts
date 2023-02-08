import { Nested } from '@panenco/papi';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { MonitorBody } from './monitor.body';

@Exclude()
export class AirspaceBody {
  @Expose()
  @IsOptional()
  public id?: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @Nested(MonitorBody, true)
  @IsOptional()
  public monitors: MonitorBody[];
}
