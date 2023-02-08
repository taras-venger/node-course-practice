import { RequestContext } from '@mikro-orm/core';
import { User } from '../../../entities/user.entity';

export const getList = async (search: string) => {
  const em = RequestContext.getEntityManager();
  const users = await em.findAndCount(
    User,
    search
      ? {
          $or: [
            { name: { $ilike: `%${search}%` } },
            { email: { $ilike: `%${search}%` } },
          ],
        }
      : {}
  );

  return users;
};
