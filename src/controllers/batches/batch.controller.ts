import { JsonController, Post, Authorized, Req } from 'routing-controllers';
import { Body, Representer, StatusCode } from '@panenco/papi';

import { createBatch } from './handlers/create.handler';
import { BatchBody } from '../../contracts/batch.body';
import { BatchView } from '../../contracts/batch.view';

@JsonController('/batch')
export class BatchController {
  @Post()
  @Authorized()
  @Representer(BatchView, StatusCode.created)
  async createBatch(@Req() request: any, @Body() body: BatchBody) {
    const { userId } = request.token;
    return createBatch(userId, body);
  }
}
