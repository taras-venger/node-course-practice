import { getEm } from '../../../tests/helpers/getEm';
import { Site } from '../../../entities/site.entity';

export const getSite = async (id: string) => {
  const em = getEm();
  const site = await em.findOneOrFail(Site, { id });
  em.flush();
  return site;
};

export const getStructure = async (id: string) => {
  const em = getEm();
  const site = await em.findOneOrFail(
    Site,
    { id },
    { populate: ['airspaces', 'airspaces.monitors'] }
  );
  return site;
};
