import { getEm } from '../../../tests/helpers/getEm';
import { UserBody } from '../../../contracts/user.body';
import { User } from '../../../entities/user.entity';

export const createUser = async (body: UserBody) => {
  const em = getEm();
  const user = em.create(User, body);
  await em.persistAndFlush(user);

  return user;
};
