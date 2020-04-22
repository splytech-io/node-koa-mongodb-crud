import { castFilter } from '@splytech-io/cast';
import { RequestValidation } from '@splytech-io/request-validation';
import { J } from './joi';
import { Collection } from './types';

export namespace ListRecordsEndpointHelper {

  export interface Request {
    query: {
      filter?: string;
      sort?: string;
      type?: string;
      fields?: string;
      limit: number;
      offset: number;
    };
  }

  export interface Options {
    filter?: string;
    forceFilter?: { [key: string]: any };
    project?: object;
    fields?: string;
    sort?: string;
    offset?: number;
    limit?: number;
    getFieldPath?: (item: string) => string;
    cast?: any;
    readPreference?: 'nearest' | 'secondaryPreferred' | string;
  }

  export interface ParsedOptions {
    filter: { [key: string]: any };
    pipeline: any[];
  }

  export interface Result<T> extends ParsedOptions {
    count: number;
    records: T[];
  }

  export const validation: RequestValidation.Rules = {
    query: J.object({
      'sort': J.string().regex(/^(([+-][^,]+),?)+$/, 'sort rules'),
      'type': J.string(),
      'fields': J.string(),
      'limit': J.number().default(20),
      'offset': J.number().default(0),
      'filter': J.string(),
    }),
  };

  /**
   *
   * @param {ListRecordsEndpointHelper.Options} options
   * @returns {ListRecordsEndpointHelper.ParsedOptions}
   */
  export function parseOptions(options: Options): ParsedOptions {
    const pipeline: any[] = [];
    const filter = processFilter(pipeline, options.filter, options.forceFilter, options.cast);

    processSort(pipeline, options.sort, options.getFieldPath);
    processPagination(pipeline, options.offset, options.limit);
    processProject(pipeline, options.fields, options.project, options.getFieldPath);

    return {
      filter,
      pipeline,
    };
  }

  /**
   *
   * @param {any[]} pipeline
   * @param {string} filter
   * @param {object} forceFilter
   * @param cast
   * @returns {{[p: string]: any}}
   */
  function processFilter(pipeline: any[], filter?: string, forceFilter?: object, cast?: any) {
    const result: { [key: string]: any } = {};

    if (filter) {
      Object.assign(result, JSON.parse(filter));
    }

    if (forceFilter) {
      Object.assign(result, forceFilter);
    }

    if (filter || forceFilter) {
      pipeline.push({ $match: result });
    }

    if (cast) {
      Object.assign(result, castFilter(result, cast));
    }

    return result;
  }

  /**
   *
   * @param {any[]} pipeline
   * @param {string} sort
   * @param {Function} getFieldPath
   */
  function processSort(pipeline: any[], sort?: string, getFieldPath?: Function) {
    if (!sort) {
      return;
    }

    const result: any = {};

    pipeline.push({ $sort: result });

    sort.split(',').forEach((item: string) => {
      const key = item.substr(1);
      const fieldPath = getFieldPath ? getFieldPath(key) : key;

      result[fieldPath] = item[0] === '-' ? -1 : 1;
    });
  }

  /**
   *
   * @param {any[]} pipeline
   * @param {number} offset
   * @param {number} limit
   */
  function processPagination(pipeline: any[], offset?: number, limit?: number) {
    if (offset) {
      pipeline.push({ $skip: offset });
    }

    if (limit) {
      pipeline.push({ $limit: limit });
    }
  }

  /**
   *
   * @param {any[]} pipeline
   * @param {string} fields
   * @param {object} project
   * @param {Function} getFieldPath
   */
  function processProject(pipeline: any[], fields?: string, project?: object, getFieldPath?: Function) {
    const result: { [key: string]: any } = {
      // '_id': 1,
    };

    if (fields) {
      fields.split(',').forEach((item: string) => {
        const value = getFieldPath ? getFieldPath(item) : item;

        result[item] = `$${ value }`;
      });
    }

    if (project) {
      Object.assign(result, project);
    }

    if (Object.keys(result).length === 0) {
      return;
    }

    pipeline.push({ $project: result });
  }

  /**
   *
   * @param {Collection} collection
   * @param {ListRecordsEndpointHelper.Options} options
   * @returns {Promise<ListRecordsEndpointHelper.Result<T>>}
   */
  export async function exec<T, ObjectID = any>(
    collection: Collection<ObjectID>,
    options: Options,
  ): Promise<Result<T>> {
    const { filter, pipeline } = parseOptions(options);
    const countPromise = collection.countDocuments(filter, {
      readPreference: options.readPreference,
    });
    const recordsPromise = collection.aggregate(pipeline, {
      readPreference: options.readPreference,
    }).toArray();

    const [count, records] = await Promise.all([countPromise, recordsPromise]);

    return {
      count,
      records,
      filter,
      pipeline,
    };
  }
}
