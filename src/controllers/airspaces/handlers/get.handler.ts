import { getEm } from '../../../tests/helpers/getEm';
import { Airspace } from '../../../entities/airspace.entity';

export const get = async (id: string) => {
  const em = getEm();
  const airspaces = await em.find(Airspace, { site: id });
  em.flush();
  return airspaces;
};
