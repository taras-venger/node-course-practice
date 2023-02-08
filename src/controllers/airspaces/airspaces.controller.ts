import {
  JsonController,
  Post,
  Authorized,
  Get,
  Param,
} from 'routing-controllers';
import { Body, Representer, StatusCode } from '@panenco/papi';

import { AirspaceView } from '../../contracts/airspace.view';
import { get } from './handlers/get.handler';

@JsonController('/sites/:id/airspaces')
export class AirspaceController {
  @Get('/')
  @Authorized()
  @Representer(AirspaceView, StatusCode.ok)
  async get(@Param('id') id: string) {
    return get(id);
  }
}
