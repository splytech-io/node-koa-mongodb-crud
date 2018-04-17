import { castFilter } from '@splytech-io/cast';
import { RequestValidation } from '@splytech-io/request-validation';
import { ObjectID } from 'bson';
import { Schema } from 'joi';
import { ResourceHelpers } from '../helpers';
import { J } from '../joi';
import { MyRequestValidation } from '../request-validation';
import { ResourceError } from '../resource-error';
import { Collection, Context, Middleware } from '../types';
import flatten = require('flat');

export namespace PatchResource {

  interface Request {
    params: {
      id: string;
    };
    body: any;
  }

  export interface Options {
    cast: { [key: string]: any };
    validation: Schema;
  }

  /**
   *
   * @param {Collection} collection
   * @param {PatchResource.Options} options
   * @returns {Middleware}
   */
  export function create(collection: Collection, options: Options): Middleware {
    const validation: RequestValidation.Rules = {
      params: J.object({
        id: J.objectId(),
      }),
      body: options.validation,
    };

    /**
     *
     */
    return async (ctx: Context) => {
      const request = MyRequestValidation.validate<Request>(ctx, validation, {
        body: {
          presence: 'optional',
        },
      });

      const body = castFilter(flatten(request.body, {
        safe: true,
      }), options.cast);

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
