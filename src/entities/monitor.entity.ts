import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Min } from 'class-validator';

import { Airspace } from './airspace.entity';
import { Gateway } from './gateway.entity';

@Entity()
export class Monitor extends BaseEntity<Monitor, 'id'> {
  @PrimaryKey({ columnType: 'bigint' })
  @Min(0)
  public id: number;

  @ManyToOne({ entity: () => Gateway, nullable: true })
  public gateway: Gateway;

  @ManyToOne({ entity: () => Airspace, nullable: true })
  public airspace: Airspace;

  @Property({ nullable: true })
  public name: string;
}
