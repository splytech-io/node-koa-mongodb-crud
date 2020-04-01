import { castFilter } from '@splytech-io/cast';
import { RequestValidation } from '@splytech-io/request-validation';
import * as J from 'joi';
import { MyRequestValidation } from '../request-validation';
import { Collection, Context, Middleware } from '../types';

export namespace AggregateResource {

  interface Request {
    query: {
      pipeline: string;
    };
  }

  export interface Options {
    cast: { [key: string]: any };
    preProcess?: (pipeline: any[]) => any[];
    readPreference?: 'nearest' | 'secondaryPreferred' | string;
  }

  /**
   *
   * @param {Collection} collection
   * @param {PutResource.Options} options
   * @returns {Middleware}
   */
  export function create(collection: Collection, options: Options): Middleware {
    const validation: RequestValidation.Rules = {
      query: J.object({
        pipeline: J.string(),
      }),
    };

    return async (ctx: Context) => {
      const request = MyRequestValidation.validate<Request>(ctx, validation);
      const preProcess: ((arr: any[]) => any) = options.preProcess || ((item) => item);
      const pipeline: any[] = JSON.parse(request.query.pipeline) || [];
      const pipelineParsed: any[] = preProcess(pipeline.map((item) => {
        if (item.$lookup) {
          throw new Error('lookup is forbidden');
        }

        if (item.$out) {
          throw new Error('out is forbidden');
        }

        if (item.$match) {
          item.$match = castFilter(item.$match, options.cast);
        }

        return item;
      }));

      ctx.status = 200;
      ctx.set('content-type', 'application/json');
      ctx.res.write('[');

      const cursor = collection.aggregate(pipelineParsed, {
        readPreference: options.readPreference || 'secondaryPreferred',
        allowDiskUse: true,
      });

      let i = 0;
      while (++i) {
        const doc = await cursor.next();

        if (!doc) {
          break;
        }

        ctx.res.write(`${i > 1 ? ',' : ''}${JSON.stringify(doc)}`);
      }

      ctx.res.write(']');
      ctx.res.end();
    };
  }
}
