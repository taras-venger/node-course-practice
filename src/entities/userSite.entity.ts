import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { User } from './user.entity';
import { Site } from './site.entity';

@Entity()
export class UserSite {
  @ManyToOne({ entity: () => User, primary: true })
  public user: User;

  @ManyToOne({ entity: () => Site, primary: true })
  public site: Site;

  @Property({ default: 1 })
  public role: number;
}
