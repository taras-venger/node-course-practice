import { getEm } from '../../../tests/helpers/getEm';
import { User } from '../../../entities/user.entity';
import { UserBody } from '../../../contracts/user.body';

export const updateUser = async (id: string, body: UserBody) => {
  const em = getEm();
  const user = await em.findOneOrFail(User, { id });
  user.assign(body);
  await em.flush();
  return user;
};
