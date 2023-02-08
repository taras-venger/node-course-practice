import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { StatusCode } from '@panenco/papi';
import { expect } from 'chai';
import { before, beforeEach, describe, it } from 'mocha';
import supertest from 'supertest';

import { App } from '../../app';
import { AirspaceView } from '../../contracts/airspace.view';

import { UserBody } from '../../contracts/user.body';

export const siteTests = describe('Site Integration Tests', () => {
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
  });

  let siteId: string;

  it('should create site', async () => {
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
      .send({
        name: 'Test Site',
        country: 'Ukraine',
        city: 'Kyiv',
        latitude: '50.4338568',
        longitude: '30.5396666',
        airspaces: [
          {
            name: 'Airspace 1',
            monitors: [
              {
                id: 1,
                name: 'Monitor A1M1',
              },
              {
                id: 2,
                name: 'Monitor A1M2',
              },
            ],
          },
          {
            name: 'Airspace 2',
            monitors: [
              {
                id: 3,
                name: 'Monitor A2M1',
              },
            ],
          },
          { name: 'Airspace 3', monitors: [] },
        ],
      })
      .expect(StatusCode.created);

    expect(postResponse.name).equal('Test Site');

    // Get created site;
    const { body: getResponse } = await request
      .get(`/api/sites/${postResponse.id}`)
      .set('x-auth', token)
      .expect(StatusCode.ok);

    const { body: getAirspacesResponse } = await request
      .get(`/api/sites/${getResponse.id}/airspaces`)
      .set('x-auth', token)
      .expect(StatusCode.ok);

    expect(getAirspacesResponse.length === 3);

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

    // Get the site structure;
    const { body: getStructure } = await request
      .get(`/api/sites/${getResponse.id}/structure`)
      .set('x-auth', token)
      .expect(StatusCode.ok);

    const { airspaces, ...siteInfo } = getStructure;
    siteInfo.name = 'Updated Site Name';
    airspaces.forEach(item => {
      item.monitors.forEach(item => {
        item.id = Number(item.id);
        item.name = `${item.name} updated`;
      });
    });

    const { body: updatedSite } = await request
      .patch(`/api/sites/${getResponse.id}`)
      .set('x-auth', token)
      .send({ airspaces, ...siteInfo })
      .expect(StatusCode.ok);
  });
});
