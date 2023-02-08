import { RequestContext } from '@mikro-orm/core';
import { Airspace } from '../../../entities/airspace.entity';

export const get = async (id: string) => {
  const em = RequestContext.getEntityManager();
  const airspaces = await em.find(Airspace, { site: id });
  em.flush();
  return airspaces;
};
