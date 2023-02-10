import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { StatusCode } from '@panenco/papi';
import { before, beforeEach, describe, it } from 'mocha';
import supertest from 'supertest';

import { App } from '../../app';
import { AirspaceView } from '../../contracts/airspace.view';

import { UserBody } from '../../contracts/user.body';
import { siteFixture } from '../fixtures';
import { getEm, RequestContextManager } from '../helpers/getEm';

describe('Integration tests', () => {
  describe('Batch tests', () => {
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
      RequestContextManager.setEm(orm.em.fork());
    });

    it('Should create batch', async () => {
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
      const { body: postSiteResponse } = await request
        .post(`/api/sites`)
        .set('x-auth', token)
        .send(siteFixture)
        .expect(StatusCode.created);

      const { body: getAirspacesResponse } = await request
        .get(`/api/sites/${postSiteResponse.id}/airspaces`)
        .set('x-auth', token)
        .expect(StatusCode.ok);

      getEm().clear();
      const { body: createBatchResponse } = await request
        .post(`/api/batch`)
        .set('x-auth', token)
        .send({
          name: 'Test Batch',
          airspaces: getAirspacesResponse.map(
            (airspace: AirspaceView) => airspace.id
          ),
        })
        .expect(StatusCode.created);
    });
  });
});
