import { getEm } from '../../../tests/helpers/getEm';
import { instanceToPlain } from 'class-transformer';

import { SiteBody } from '../../../contracts/site.body';
import { Site } from '../../../entities/site.entity';
import { AirspaceBody } from '../../../contracts/airspace.body';
import { Airspace } from '../../../entities/airspace.entity';
import { Monitor } from '../../../entities/monitor.entity';

export const patch = async (id: string, body: SiteBody) => {
  const em = getEm();
  const site = await em.findOneOrFail(Site, { id });
  const { airspaces, ...siteInfo } = body;
  site.assign(siteInfo);

  await Promise.all(
    airspaces.map(async (airspace: AirspaceBody) => {
      const { monitors, ...airspaceInfo } = airspace;
      await em.nativeUpdate(
        Airspace,
        { id: airspaceInfo.id },
        { ...airspaceInfo }
      );

      if (monitors) {
        await Promise.all(
          monitors.map(
            async monitor =>
              await em.nativeUpdate(Monitor, { id: monitor.id }, { ...monitor })
          )
        );
      }
    })
  );

  await em.flush();
  return body;
};
