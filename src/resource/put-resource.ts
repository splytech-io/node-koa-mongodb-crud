import { castDocument } from '@splytech-io/cast';
import { RequestValidation } from '@splytech-io/request-validation';
import { ObjectID } from 'bson';
import { Schema } from 'joi';
import { ResourceHelpers } from '../helpers';
import { J } from '../joi';
import { MyRequestValidation } from '../request-validation';
import { ResourceError } from '../resource-error';
import { Collection, Context, Middleware } from '../types';

export namespace PutResource {

  interface Request {
    params: {
      id: string;
    };
    body: {
      spec: any;
    };
  }

  export interface Options {
    validation: Schema;
    cast: { [key: string]: any };
  }

  /**
   *
   * @param {Collection} collection
   * @param {PutResource.Options} options
   * @returns {Middleware}
   */
  export function create(collection: Collection, options: Options): Middleware {
    const validation: RequestValidation.Rules = {
      params: J.object({
        id: J.objectId(),
      }),
      body: options.validation,
    };

    return async (ctx: Context) => {
      const request = MyRequestValidation.validate<Request>(ctx, validation);
      const body = castDocument(request.body, options.cast);

      const result = await collection.updateOne({
        '_id': new ObjectID(request.params.id),
      }, {
        $set: {
          ...body,
          'updated': new Date(),
        },
      }).catch(ResourceHelpers.handleDuplicateRecordError);

      if (!result.matchedCount) {
        throw new ResourceError.NOT_FOUND();
      }

      ctx.status = 204;
    };
  }
}
