import {
  JsonController,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  Authorized,
  Req,
} from 'routing-controllers';
import {
  Body,
  ListRepresenter,
  Query,
  Representer,
  StatusCode,
} from '@panenco/papi';

import { getList } from './handlers/getList.handler';
import { createUser } from './handlers/create.handler';
import { getUser } from './handlers/get.handler';
import { updateUser } from './handlers/update.handler';
import { deleteUser } from './handlers/delete.handler';

import { UserView } from '../../contracts/user.view';
import { UserBody } from '../../contracts/user.body';
import { SearchQuery } from '../../contracts/search.query';
import { OpenAPI } from 'routing-controllers-openapi';

@JsonController('/users')
export class UserController {
  @Post()
  @Representer(UserView, StatusCode.created)
  @OpenAPI({ summary: 'Create a new user' })
  async createUser(@Body() body: UserBody, @Req() req) {
    console.log(req);
    const user = await createUser(body);
    return user;
  }

  @Get()
  @Authorized()
  @ListRepresenter(UserView)
  async getList(@Query() query: SearchQuery) {
    return getList(query.search);
  }

  @Get('/:id')
  @Authorized()
  @Representer(UserView)
  async getUser(@Param('id') id: string) {
    return getUser(id);
  }

  @Patch('/:id')
  @Authorized()
  @Representer(UserView)
  async updateUser(
    @Param('id') id: string,
    @Body({}, { skipMissingProperties: true }) body: UserBody
  ) {
    return updateUser(id, body);
  }

  @Delete('/:id')
  @Authorized()
  @Representer(null)
  async deleteUser(@Param('id') id: string) {
    return deleteUser(id);
  }
}
