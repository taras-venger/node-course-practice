import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

import { Airspace } from './airspace.entity';
import { UserSite } from './userSite.entity';

@Entity()
export class Site extends BaseEntity<Site, 'id'> {
  @PrimaryKey({ columnType: 'uuid' })
  public id: string = v4();

  @Property()
  public name: string;

  @Property()
  public country: string;

  @Property()
  public city: string;

  @Property({ columnType: 'float' })
  public latitude: number;

  @Property({ columnType: 'float' })
  public longitude: number;

  @OneToMany(() => Airspace, airspace => airspace.site)
  public airspaces = new Collection<Airspace>(this);

  @OneToMany(() => UserSite, us => us.site)
  userSite = new Collection<UserSite>(this);
}
