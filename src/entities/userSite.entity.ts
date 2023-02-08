import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { User } from './user.entity';
import { Site } from './site.entity';

export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}

@Entity()
export class UserSite {
  @ManyToOne({ entity: () => User, primary: true })
  public user: User;

  @ManyToOne({ entity: () => Site, primary: true })
  public site: Site;

  @Property({ default: Role.User })
  public role: Role;
}
