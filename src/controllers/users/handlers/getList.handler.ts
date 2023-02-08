import { getEm } from '../../../tests/helpers/getEm';
import { User } from '../../../entities/user.entity';

export const getList = async (search: string) => {
  const em = getEm();
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
