import { ListRecordsEndpointHelper } from '../list-records-endpoint.helper';
import { MyRequestValidation } from '../request-validation';
import { Collection, Context, Middleware } from '../types';

export namespace ListResources {
  export interface Options {
    cast: object;
  }

  /**
   *
   * @param {Collection} collection
   * @param {ListResources.Options} options
   * @returns {Middleware}
   */
  export function create(collection: Collection, options: Options): Middleware {
    return async (ctx: Context) => {
      const { query } = MyRequestValidation.validate<ListRecordsEndpointHelper.Request>(
        ctx,
        ListRecordsEndpointHelper.validation,
      );

      const result = await ListRecordsEndpointHelper.exec(collection, {
        filter: query.filter,
        fields: query.fields,
        sort: query.sort,
        offset: query.offset,
        limit: query.limit,
        cast: options.cast,
      });

      ctx.body = {
        items: result.records,
        total_count: result.count,
        limit: query.limit,
        offset: query.offset,
      };
    };
  }

}
