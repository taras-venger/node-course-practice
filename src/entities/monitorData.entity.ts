import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { Monitor } from './monitor.entity';

@Entity()
export class MonitorData {
  @ManyToOne({ primary: true })
  public monitor: Monitor;

  @Property({ columnType: 'float' })
  public temperature: number;

  @Property({ columnType: 'float' })
  public humidity: number;

  @Property({ primary: true, columnType: 'timestamp' })
  public date: string;
}
