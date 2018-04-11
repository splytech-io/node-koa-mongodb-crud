import { RequestValidation } from '@splytech-io/request-validation';
import { ObjectID } from 'bson';
import { J } from '../joi';
import { MyRequestValidation } from '../request-validation';
import { ResourceError } from '../resource-error';
import { Collection, Context, Middleware } from '../types';

export namespace DeleteResource {

  interface Request {
    params: {
      id: string;
    };
  }

  /**
   *
   * @param {Collection} collection
   * @returns {Middleware}
   */
  export function create(collection: Collection): Middleware {
    const validation: RequestValidation.Rules = {
      params: J.object({
        id: J.objectId(),
      }),
    };

    /**
     *
     */
    return async (ctx: Context) => {
      const { params } = MyRequestValidation.validate<Request>(ctx, validation);

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
