import { RequestContext } from '@mikro-orm/core';
import { Site } from '../../../entities/site.entity';

export const get = async (id: string) => {
  const em = RequestContext.getEntityManager();
  const site = await em.findOneOrFail(Site, { id });
  em.flush();
  return site;
};

export const getStructure = async (id: string) => {
  const em = RequestContext.getEntityManager();
  const site = await em.findOneOrFail(
    Site,
    { id },
    { populate: ['airspaces', 'airspaces.monitors'] }
  );
  console.log('getStructure: ', site);
  return site;
};