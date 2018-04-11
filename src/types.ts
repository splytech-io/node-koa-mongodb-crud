import { ObjectID } from 'bson';

export interface Collection {
  count: (filter: any) => Promise<number>;
  aggregate: (pipeline: any) => {
    toArray: () => Promise<any>;
  };
  deleteOne: (filter: any, options?: any) => Promise<{
    deletedCount?: number;
  }>;

  findOne: (filter: any) => Promise<any>;
  insertOne: (doc: any) => Promise<{
    insertedId: ObjectID;
  }>;
  updateOne: (filter: any, update: any) => Promise<{
    modifiedCount: number;
    // matchedCount: number;
  }>;
}

export interface Context {
  status?: number;
  body?: object;
  params: object;
  query: object;
  request: {
    body: object;
  };
}

export type Middleware = (ctx: Context, next?: Function) => Promise<void>;
