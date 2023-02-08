import { RequestContext } from '@mikro-orm/core';
import { instanceToPlain } from 'class-transformer';

import { SiteBody } from '../../../contracts/site.body';
import { Site } from '../../../entities/site.entity';
import { Monitor } from '../../../entities/monitor.entity';
import { Role, UserSite } from '../../../entities/userSite.entity';
import { Airspace } from '../../../entities/airspace.entity';

export const createSite = async (body: SiteBody, userId: string) => {
  const em = RequestContext.getEntityManager();

  const { airspaces, ...rest } = body;

  const site = em.create(Site, instanceToPlain(rest));
  await em.persistAndFlush(site);

  await Promise.all(
    airspaces.map(async item => {
      const { monitors, ...rest } = item;
      const airspace = em.create(Airspace, { site: site.id, ...rest });
      await em.persistAndFlush(airspace);

      if (monitors) {
        await Promise.all(
          monitors.map(
            async item =>
              await em.nativeUpdate(
                Monitor,
                {
                  $and: [{ id: item.id }, { airspace: null }],
                },
                { name: item.name, airspace: airspace.id }
              )
          )
        );
      }
    })
  );

  const userSite = em.create(UserSite, {
    user: userId,
    site: site.id,
    role: Role.Admin,
  });
  await em.persistAndFlush(userSite);

  return site;
};
