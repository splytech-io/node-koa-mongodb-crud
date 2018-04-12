import { castDocument } from '@splytech-io/cast';
import { RequestValidation } from '@splytech-io/request-validation';
import { ObjectID } from 'bson';
import { Schema } from 'joi';
import { ResourceHelpers } from '../helpers';
import { MyRequestValidation } from '../request-validation';
import { Collection, Context, Middleware } from '../types';

export namespace PostResource {
  export interface Request {
    body: any;
  }

  export interface Options {
    validation: Schema;
    preProcess?: (request: Request) => void;
    documentFormatter?: (request: Request) => object;
    cast: { [key: string]: any };
  }

  /**
   *
   * @param {Collection} collection
   * @param {PostResource.Options} options
   * @returns {Middleware}
   */
  export function create(collection: Collection, options: Options): Middleware {
    const validation: RequestValidation.Rules = {
      body: options.validation,
    };

    return async (ctx: Context) => {
      const request = MyRequestValidation.validate<Request>(ctx, validation);

      // request.body is used in options.documentFormatter()
      request.body = castDocument(request.body, options.cast);

      if (options.preProcess) {
        options.preProcess(request);
      }

      const doc = options.documentFormatter
        ? options.documentFormatter(request)
        : {
          _id: new ObjectID(),
          ...request.body,
          created: new Date(),
          updated: new Date(),
        };

      const result = await collection.insertOne(doc)
        .catch(ResourceHelpers.handleDuplicateRecordError);

      ctx.status = 201;
      ctx.body = {
        inserted_id: result.insertedId,
      };
    };
  }

}
