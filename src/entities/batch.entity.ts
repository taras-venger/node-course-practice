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

import { Airspace } from './airspace.entity';
import { User } from './user.entity';

@Entity()
export class Batch extends BaseEntity<Batch, 'id'> {
  @PrimaryKey({ columnType: 'uuid' })
  public id: string = v4();

  @Property()
  public name: string;

  @ManyToOne(() => User)
  public user: User;

  @OneToMany(() => Airspace, airspace => airspace.batch)
  airspaces = new Collection<Airspace>(this);
}
