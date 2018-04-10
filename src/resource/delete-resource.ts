import { RequestValidation } from '@splytech-io/request-validation';
import { ObjectID } from 'bson';
import { J } from '../joi';
import { ResourceError } from '../resource-error';
import { Collection } from '../types';
import Application = require('koa');

export namespace DeleteResource {

  interface Request {
    params: {
      id: string;
    };
  }

  export function create(collection: Collection) {
    const validation: RequestValidation.Rules = {
      params: J.object({
        id: J.objectId(),
      }),
    };

    return async (ctx: Application.Context) => {
      const { params } = RequestValidation.validate<Request>(ctx, validation);

      const result = await collection.deleteOne({
        '_id': new ObjectID(params.id),
      });

      if (!result.deletedCount) {
        throw new ResourceError.NOT_FOUND();
      }

      ctx.status = 204;
    };
  }
}
