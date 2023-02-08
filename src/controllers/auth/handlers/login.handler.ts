import { createAccessToken, Unauthorized } from '@panenco/papi';
import { getEm } from '../../../tests/helpers/getEm';

import { User } from '../../../entities/user.entity';
import { LoginBody } from '../../../contracts/login.body';

export const login = async (body: LoginBody) => {
  const user = await getEm().findOne(User, {
    email: body.email,
  });

  if (!user || user.password !== body.password) {
    throw new Unauthorized('Unauthorized', 'Invalid credentials');
  }
  const result = await createAccessToken(
    'jwtSecretFromConfigHere',
    8 * 60 * 60,
    {
      userId: user.id,
    }
  );

  return result;
};
