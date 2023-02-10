import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { expect } from 'chai';
import { before, beforeEach, describe, it } from 'mocha';
import {
  getSite,
  getStructure,
} from '../../controllers/sites/handlers/get.handler';
import { patch } from '../../controllers/sites/handlers/patch.handler';
import { get as getAirspace } from '../../controllers/airspaces/handlers/get.handler';

import { Site } from '../../entities/site.entity';
import { User } from '../../entities/user.entity';
import ormConfig from '../../orm.config';
import { siteFixture, userFixtures } from '../fixtures';
import { RequestContextManager } from '../helpers/getEm';

describe('Handler tests', () => {
  describe('Site Tests', () => {
    let orm: MikroORM<PostgreSqlDriver>;
    let user: User;
    let site: Site;
    before(async () => {
      orm = await MikroORM.init(ormConfig);
    });

    beforeEach(async () => {
      await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
      await orm.getMigrator().up();
      const em = orm.em.fork();
      user = em.create(User, userFixtures[0]);
      site = em.create(Site, siteFixture);
      await em.persistAndFlush([user, site]);
      RequestContextManager.setEm(em);
    });

    it('Should get site by id', async () => {
      const res = await getSite(site.id);
      expect(res.name === 'Test Site').true;
      // expect(res).to.not.have.property('airspaces');
    });

    it('Should get site structure', async () => {
      const res = await getStructure(site.id);
      expect(res.name === 'Test Site').true;
      expect(res.airspaces.toArray().some(a => a.monitors)).true;
    });

    it('Should update site', async () => {
      const res = await patch(site.id, {
        ...siteFixture,
        name: 'Updated',
        country: 'Updated',
      });
      expect(res.name === 'Updated' && res.country === 'Updated').true;
    });

    it('Should get sites airspaces by id', async () => {
      const res = await getAirspace(site.id);
      expect(res[0]).to.have.property('monitors');
    });
  });
});
