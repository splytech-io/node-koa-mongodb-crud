import { castDocument } from '@splytech-io/cast';
import { RequestValidation } from '@splytech-io/request-validation';
import { ObjectID } from 'bson';
import { Schema } from 'joi';
import { ResourceHelpers } from '../helpers';
import { Collection } from '../types';
import Application = require('koa');

export namespace PostResource {
  export interface Request {
    body: any;
  }

  export interface Options {
    validation: Schema;
    additionalValidation?: (request: Request) => void;
    documentFormatter?: (request: Request) => object;
    cast: { [key: string]: any };
  }

  /**
   *
   * @param {MongoDB.Collection} collection
   * @param {PostResource.Options} options
   * @returns {(ctx: Application.Context) => Promise<void>}
   */
  export function create(collection: Collection, options: Options) {
    const validation: RequestValidation.Rules = {
      body: <any>options.validation,
    };

    return async (ctx: Application.Context) => {
      const request = RequestValidation.validate<Request>(ctx, validation);

      if (options.additionalValidation) {
        options.additionalValidation(request);
      }

      // request.body is used in options.documentFormatter()
      request.body = castDocument(request.body, options.cast);

      const doc = options.documentFormatter
        ? options.documentFormatter(request)
        : {
          _id: new ObjectID(),
          ...request.body,
          created: new Date(),
          updated: new Date(),
        };

      const result = await collection.insertOne(doc).catch(ResourceHelpers.handleDuplicateRecordError);

      ctx.status = 201;
      ctx.body = {
        inserted_id: result.insertedId,
      };
    };
  }

}
