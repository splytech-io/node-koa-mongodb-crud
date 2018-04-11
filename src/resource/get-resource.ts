import { RequestValidation } from '@splytech-io/request-validation';
import { ObjectID } from 'bson';
import { J } from '../joi';
import { MyRequestValidation } from '../request-validation';
import { ResourceError } from '../resource-error';
import { Collection, Context, Middleware } from '../types';

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

  /**
   *
   * @param {Collection} collection
   * @returns {Middleware}
   */
  export function create(collection: Collection): Middleware {
    return async (ctx: Context) => {
      const { params } = MyRequestValidation.validate<Request>(ctx, validation);

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
