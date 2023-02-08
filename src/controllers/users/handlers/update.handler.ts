import { RequestContext } from '@mikro-orm/core';
import { User } from '../../../entities/user.entity';
import { UserBody } from '../../../contracts/user.body';

export const updateUser = async (id: string, body: UserBody) => {
  const em = RequestContext.getEntityManager();
  const user = await em.findOneOrFail(User, { id });
  user.assign(body);
  await em.flush();
  return user;
};
