import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Batch } from './batch.entity';
import { UserSite } from './userSite.entity';

@Entity()
export class User extends BaseEntity<User, 'id'> {
  @PrimaryKey({ columnType: 'uuid' })
  public id: string = v4();

  @Property()
  public name: string;

  @Property({ unique: true })
  public email: string;

  @Property()
  public password: string;

  @OneToMany(() => Batch, batch => batch.user)
  batches = new Collection<Batch>(this);

  @OneToMany(() => UserSite, us => us.user)
  userSite = new Collection<UserSite>(this);
}
