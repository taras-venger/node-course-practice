import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { StatusCode } from '@panenco/papi';
import { expect } from 'chai';
import { before, beforeEach, describe, it } from 'mocha';
import supertest from 'supertest';

import { App } from '../../app';
import { AirspaceBody } from '../../contracts/airspace.body';
import { AirspaceView } from '../../contracts/airspace.view';
import { MonitorView } from '../../contracts/monitor.view';

import { UserBody } from '../../contracts/user.body';
import { siteFixture } from '../fixtures';
import { getEm, RequestContextManager } from '../helpers/getEm';

describe('Integration tests', () => {
  describe('Site Tests', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let orm: MikroORM<PostgreSqlDriver>;

    before(async () => {
      const app = new App();
      await app.createConnection();
      orm = app.orm;
      request = supertest(app.host);
    });

    beforeEach(async () => {
      await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
      await orm.getMigrator().up();
      await orm.em
        .execute(`INSERT INTO gateway("id", "name") VALUES(1, 'Gateway 1');
    INSERT INTO monitor("id", "gateway_id") VALUES(1, 1), (2, 1), (3, 1), (4, 1), (5, 1)`);
      RequestContextManager.setEm(orm.em.fork());
    });

    it('Should create and update site', async () => {
      // Successfully create new user
      await request
        .post(`/api/users`)
        .send({
          name: 'test',
          email: 'test-user@panenco.com',
          password: 'password',
        } as UserBody)
        .expect(StatusCode.created);

      // Login
      const { body: loginResponse } = await request
        .post('/api/auth/tokens')
        .send({
          email: 'test-user@panenco.com',
          password: 'password',
        })
        .expect(StatusCode.ok);

      const token = loginResponse.token;

      // Create a site
      const { body: postResponse } = await request
        .post(`/api/sites`)
        .set('x-auth', token)
        .send(siteFixture)
        .expect(StatusCode.created);

      expect(postResponse.name).equal('Test Site');

      // Get created site;
      const { body: getResponse } = await request
        .get(`/api/sites/${postResponse.id}`)
        .set('x-auth', token)
        .expect(StatusCode.ok);

      // Get created airspaces;
      const { body: getAirspacesResponse } = await request
        .get(`/api/sites/${getResponse.id}/airspaces`)
        .set('x-auth', token)
        .expect(StatusCode.ok);

      expect(getAirspacesResponse.length === 3);

      // Get the site structure;
      getEm().clear();
      const { body: getStructure } = await request
        .get(`/api/sites/${getResponse.id}/structure`)
        .set('x-auth', token)
        .expect(StatusCode.ok);

      // Update site;
      const { airspaces, ...siteInfo } = getStructure;
      siteInfo.name = 'Updated Site Name';
      airspaces.forEach((item: AirspaceBody) => {
        if (item.name === 'Airspace 1') {
          item.name = 'Updated Airspace Name';
          item.monitors.forEach(item => (item.name = 'Updated Monitor Name'));
        }
      });

      await request
        .patch(`/api/sites/${getResponse.id}`)
        .set('x-auth', token)
        .send({ airspaces, ...siteInfo })
        .expect(StatusCode.ok);

      const { body: getUpdatedStructure } = await request
        .get(`/api/sites/${getResponse.id}/structure`)
        .set('x-auth', token)
        .expect(StatusCode.ok);

      expect(
        getUpdatedStructure.name === 'Updated Site Name' &&
          getUpdatedStructure.airspaces.find(
            (a: AirspaceView) =>
              a.name === 'Updated Airspace Name' &&
              a.monitors.every(
                (m: MonitorView) => m.name === 'Updated Monitor Name'
              )
          )
      );
    });
  });
});
