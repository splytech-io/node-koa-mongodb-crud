import { ObjectID } from 'bson';
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
  return {
    count: async () => 3,
    aggregate: () => ({
      toArray: async () => [{
        _id: 1,
      }, {
        _id: 2,
      }, {
        _id: 3,
      }],
      next: async () => {
      },
    }),
    deleteOne: async () => ({ deletedCount: 1 }),
    findOne: async () => ({}),
    updateOne: async () => ({
      matchedCount: 0,
    }),
    insertOne: async () => ({
      insertedId: new ObjectID('01'.repeat(12)),
    }),
  };
}

/**
 *
 * @param {ContextOptions} options
 * @returns {Context}
 */
export function createContext(options: ContextOptions = {}): Context {
  const headers: any = {};
  const result = {
    res: '',
  };

  return {
    ...(<any>{ result }),
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
    set: (key: string, value: string) => headers[key] = value,
    res: {
      write: (chunk) => result.res += chunk,
      end: (chunk) => chunk && (result.res += chunk),
    },
  };
}

