import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Min } from 'class-validator';
import { Monitor } from './monitor.entity';

@Entity()
export class Gateway extends BaseEntity<Gateway, 'id'> {
  @PrimaryKey({ columnType: 'bigint' })
  @Min(0)
  public id: number;

  @Property()
  public name: string;

  @OneToMany(() => Monitor, monitor => monitor.gateway)
  monitors = new Collection<Monitor>(this);
}
