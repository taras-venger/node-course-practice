import {
  JsonController,
  Post,
  Authorized,
  Get,
  Param,
  Patch,
  Req,
} from 'routing-controllers';
import { Body, Representer, StatusCode } from '@panenco/papi';

import { createSite } from './handlers/create.handler';
import { SiteBody } from '../../contracts/site.body';
import { SiteView } from '../../contracts/site.view';
import { getSite, getStructure } from './handlers/get.handler';
import { patch } from './handlers/patch.handler';
import { SiteStructureView } from '../../contracts/siteStructure.view';

@JsonController('/sites')
export class SiteController {
  @Post()
  @Authorized()
  @Representer(SiteView, StatusCode.created)
  async createSite(@Body() body: SiteBody, @Req() request: any) {
    const { userId } = request.token;
    return await createSite(body, userId);
  }

  @Get('/:id')
  @Authorized()
  @Representer(SiteView, StatusCode.ok)
  async getSite(@Param('id') id: string) {
    return getSite(id);
  }

  @Get('/:id/structure')
  @Authorized()
  @Representer(SiteStructureView, StatusCode.ok)
  async getStructure(@Param('id') id: string) {
    return getStructure(id);
  }

  // @Patch('/:id')
  // @Authorized()
  // @Representer(SiteView, StatusCode.ok)
  // async patch(@Param('id') id: string, @Body() body: SiteBody) {
  //   return patch(id, body);
  // }
}
