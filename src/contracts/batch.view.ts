import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class BatchView {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString({ each: true })
  public airspaces: string[];
}
