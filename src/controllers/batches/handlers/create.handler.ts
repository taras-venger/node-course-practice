import { getEm } from '../../../tests/helpers/getEm';

import { BatchBody } from '../../../contracts/batch.body';
import { Batch } from '../../../entities/batch.entity';
import { Airspace } from '../../../entities/airspace.entity';

export const createBatch = async (user: string, body: BatchBody) => {
  const em = getEm();
  // check if airspace is available
  const available = await em.find(Airspace, { batch: null });
  if (!available) return;

  const airspaces = body.airspaces.filter(id =>
    available.map(el => el.id).includes(id)
  );

  const batch = em.create(Batch, { ...body, airspaces, user });

  await em.persistAndFlush(batch);
  return batch;
};
