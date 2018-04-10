import { castFilter } from '@splytech-io/cast';
import { RequestValidation } from '@splytech-io/request-validation';
import { ObjectID } from 'bson';
import { Schema } from 'joi';
import { ResourceHelpers } from '../helpers';
import { J } from '../joi';
import { ResourceError } from '../resource-error';
import { Collection } from '../types';
import flatten = require('flat');
import Application = require('koa');

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

  export function create(collection: Collection, options: Options) {
    const validation: RequestValidation.Rules = {
      params: J.object({
        id: J.objectId(),
      }),
      body: <any>options.validation,
    };

    return async (ctx: Application.Context) => {
      const request = RequestValidation.validate<Request>(ctx, validation, {
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

      if (!result.modifiedCount) {
        throw new ResourceError.NOT_FOUND();
      }

      ctx.status = 204;
    };
  }
}
