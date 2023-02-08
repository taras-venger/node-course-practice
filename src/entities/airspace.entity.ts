import {
  BaseEntity,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

import { Site } from './site.entity';
import { Batch } from './batch.entity';
import { Monitor } from './monitor.entity';

@Entity()
export class Airspace extends BaseEntity<Airspace, 'id'> {
  @PrimaryKey({ columnType: 'uuid' })
  public id: string = v4();

  @Property()
  public name: string;

  @ManyToOne(() => Site)
  public site: Site;

  @ManyToOne({ entity: () => Batch, nullable: true })
  public batch?: Batch;

  @OneToMany(() => Monitor, monitor => monitor.airspace)
  monitors = new Collection<Monitor>(this);
}
