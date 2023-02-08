import { getEm } from '../../../tests/helpers/getEm';
import { instanceToPlain } from 'class-transformer';

import { SiteBody } from '../../../contracts/site.body';
import { Site } from '../../../entities/site.entity';

export const patch = async (id: string, body: SiteBody) => {
  // const em = getEm();
  // const site = await em.findOneOrFail(Site, { id });
  // site.assign(instanceToPlain(body));
  // await em.flush();
  return body;
};
