import 'express-async-errors';
import express, { Application, NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import {
  errorMiddleware,
  getAuthenticator,
  validationMetadatasToSchemas,
} from '@panenco/papi';
import {
  getMetadataArgsStorage,
  RoutingControllersOptions,
  useExpressServer,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

import { UserController } from './controllers/users/user.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { SiteController } from './controllers/sites/site.controller';
import { BatchController } from './controllers/batches/batch.controller';
import { AirspaceController } from './controllers/airspaces/airspaces.controller';

import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import ormConfig from './orm.config';

export class App {
  public host: Application;
  public orm: MikroORM<PostgreSqlDriver>;

  constructor() {
    this.host = express();

    this.host.use(express.json());

    this.host.use((req, __, next: NextFunction) => {
      (req as any).em = this.orm.em.fork();
      RequestContext.create((req as any).em, next);
    });

    this.initializeControllers([
      UserController,
      AuthController,
      SiteController,
      AirspaceController,
      BatchController,
    ]);
    this.initializeSwagger();

    // General after middleware
    this.host.use((req: Request, res: Response, next: NextFunction) => {
      res.status(400).send('No endpoint found');
    });

    //Error middleware
    this.host.use(errorMiddleware);
  }

  listen() {
    this.host.listen(3000, () => {
      console.info(`🚀 http://localhost:3000`);
      console.info(`========================`);
    });
  }

  private initializeControllers(controllers: Function[]) {
    useExpressServer(this.host, {
      // Link the express host to routing-controllers
      cors: {
        origin: '*', // Allow all origins, any application on any url can call our api. This is why we also added the `cors` package.
        exposedHeaders: ['x-auth'], // Allow the header `x-auth` to be exposed to the client. This is needed for the authentication to work later.
      },
      controllers, // Provide the controllers. Currently this won't work yet, first we need to convert the Route to a routing-controllers controller.
      defaultErrorHandler: false, // Disable the default error handler. We will handle errors through papi later.
      routePrefix: '/api', // Map all routes to the `/api` path.
      authorizationChecker: getAuthenticator('jwtSecretFromConfigHere'),
    });
  }

  private initializeSwagger() {
    const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    }); // convert the metadata to an OpenAPI json schema

    const routingControllersOptions: RoutingControllersOptions = {
      routePrefix: '/api', // Set the route prefix so swagger knows all endpoints are prefixed with /api
    }; // configure some general options

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      // Convert the routing controller metadata + the class-validator metadata into an OpenAPI spec
      components: {
        schemas,
        securitySchemes: {
          // Add a security scheme so we will be able to enter a token on the endpoints
          JWT: {
            in: 'header',
            name: 'x-auth', // Define the header key to use
            type: 'apiKey',
            bearerFormat: 'JWT',
            description:
              'JWT Authorization header using the JWT scheme. Example: "x-auth: {token}"',
          },
        },
      },
      security: [{ JWT: [] }],
    });

    this.host.use('/docs', swaggerUi.serve, swaggerUi.setup(spec)); // Host swagger ui on /docs
  }

  public async createConnection() {
    try {
      this.orm = await MikroORM.init(ormConfig);
    } catch (error) {
      console.log('Error while connecting to the database', error);
      throw error;
    }
  }
}
