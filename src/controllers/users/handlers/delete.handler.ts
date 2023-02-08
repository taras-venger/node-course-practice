import { getEm } from '../../../tests/helpers/getEm';
import { User } from '../../../entities/user.entity';

export const deleteUser = async (id: string) => {
  const em = getEm();
  const user = await em.findOneOrFail(User, { id });
  await em.removeAndFlush(user);
};
