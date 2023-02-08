import { RequestContext } from '@mikro-orm/core';
import { instanceToPlain } from 'class-transformer';

import { SiteBody } from '../../../contracts/site.body';
import { Site } from '../../../entities/site.entity';

export const patch = async (id: string, body: SiteBody) => {
  const em = RequestContext.getEntityManager();
  const site = await em.findOneOrFail(Site, { id });
  site.assign(instanceToPlain(body));
  await em.flush();
  return site;
};
