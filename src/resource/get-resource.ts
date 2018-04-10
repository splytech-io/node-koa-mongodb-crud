import { RequestValidation } from '@splytech-io/request-validation';
import { ObjectID } from 'bson';
import { J } from '../joi';
import { ResourceError } from '../resource-error';
import { Collection } from '../types';
import Application = require('koa');

export namespace GetResource {

  interface Request {
    params: {
      id: string;
    };
  }

  const validation: RequestValidation.Rules = {
    params: J.object({
      id: J.objectId(),
    }),
  };

  export function create(collection: Collection) {
    return async (ctx: Application.Context) => {
      const { params } = RequestValidation.validate<Request>(ctx, validation);

      const record = await collection.findOne({
        '_id': new ObjectID(params.id),
      });

      if (!record) {
        throw new ResourceError.NOT_FOUND();
      }

      ctx.body = record;
    };
  }
}
