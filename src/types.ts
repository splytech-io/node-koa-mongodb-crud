export interface Collection {
  count: (filter: any) => Promise<number>;
  aggregate: (pipeline: any) => {
    toArray: () => Promise<any>;
  };
  deleteOne: (filter: any) => Promise<{
    deletedCount: number;
  }>;

  findOne: (filter: any) => Promise<any>;
  insertOne: (doc: any) => Promise<{
    insertedId: any;
  }>;
  updateOne: (filter: any, update: any) => Promise<{
    modifiedCount: number;
    // matchedCount: number;
  }>;
}
