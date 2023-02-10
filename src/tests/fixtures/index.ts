import { SiteBody } from '../../contracts/site.body';
import { User } from '../../entities/user.entity';

export const userFixtures: User[] = [
  {
    name: 'test1',
    email: 'test-user+1@panenco.com',
    password: 'password1',
  } as User,
  {
    name: 'test2',
    email: 'test-user+2@panenco.com',
    password: 'password2',
  } as User,
];

export const siteFixture: SiteBody = {
  name: 'Test Site',
  country: 'Ukraine',
  city: 'Kyiv',
  latitude: 50.4338568,
  longitude: 30.5396666,
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
};
