import { ListRecordsEndpointHelper } from '../list-records-endpoint.helper';
import { MyRequestValidation } from '../request-validation';
import { Collection, Context, Middleware } from '../types';

export namespace ListResources {
  export interface Options {
    cast: object;
    preProcess?: (options: ListRecordsEndpointHelper.Options) => void;
    postProcess?: <T>(result: ListRecordsEndpointHelper.Result<T>) => void;
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

      const limit = query.limit;

      const listRecordsOptions = {
        filter: query.filter,
        fields: query.fields,
        sort: query.sort,
        offset: query.offset,
        limit: limit + 1,
        cast: options.cast,
      };

      if (options.preProcess) {
        options.preProcess(listRecordsOptions);
      }

      const result = await ListRecordsEndpointHelper.exec(collection, listRecordsOptions);
      const hasNext = (result.records.length > limit);

      if (options.postProcess) {
        options.postProcess(result);
      }

      ctx.body = {
        items: result.records.slice(0, limit),
        has_next: hasNext,
        limit: query.limit,
        offset: query.offset,
      };
    };
  }

}
