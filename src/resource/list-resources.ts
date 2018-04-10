import { RequestValidation } from '@splytech-io/request-validation';
import { ListRecordsEndpointHelper } from '../list-records-endpoint.helper';
import { Collection } from '../types';
import Application = require('koa');

export namespace ListResources {
  export interface Options {
    cast: object;
  }

  /**
   *
   * @param {Collection} collection
   * @param {ListResources.Options} options
   * @returns {(ctx: Application.Context) => Promise<void>}
   */
  export function create(collection: Collection, options: Options) {
    return async (ctx: Application.Context) => {
      const { query } = RequestValidation.validate<ListRecordsEndpointHelper.Request>(
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
