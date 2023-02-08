import { Nested } from '@panenco/papi';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { MonitorView } from './monitor.view';

@Exclude()
export class AirspaceView {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @Nested(MonitorView, true)
  public monitors: MonitorView[];
}
