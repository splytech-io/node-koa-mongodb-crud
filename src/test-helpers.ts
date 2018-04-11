import { Collection, Context } from './types';

export interface ContextOptions {
  params?: object;
  query?: object;
  body?: object;
}

/**
 *
 * @returns {Collection}
 */
export function createCollection(): Collection {
  return <any>{
    count: async () => 3,
    aggregate: () => ({
      toArray: async () => [{
        _id: 1,
      }, {
        _id: 2,
      }, {
        _id: 3,
      }],
    }),
    deleteOne: async () => ({ deletedCount: 1 }),
    findOne: async () => ({}),
    updateOne: async () => ({
      modifiedCount: 0,
    }),
  };
}

/**
 *
 * @param {ContextOptions} options
 * @returns {Context}
 */
export function createContext(options: ContextOptions = {}): Context {
  return {
    params: {
      ...options.params,
    },
    query: {
      ...options.query,
    },
    request: {
      body: {
        ...options.body,
      },
    },
  };
}

