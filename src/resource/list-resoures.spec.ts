import { expect, use } from 'chai';
import { createCollection, createContext } from '../test-helpers';
import { ListResources } from './list-resources';
import chaiAsPromised = require('chai-as-promised');
import sinon = require('sinon');

use(chaiAsPromised);

describe('list-resources', () => {
  const sandbox = sinon.sandbox.create();
  const cast = {};

  afterEach(() => {
    sandbox.restore();
  });

  it('should succeed', async () => {
    const collection = createCollection();
    sandbox.stub(collection, 'count').returns(1);
    sandbox.stub(collection, 'aggregate').returns({
      toArray: async () => ([{
        _id: 1,
      }]),
    });
    const middleware = ListResources.create(collection, {
      cast,
    });
    const ctx = createContext({
      params: {
        id: '0'.repeat(24),
      },
    });

    await middleware(ctx);

    expect(ctx.body).to.deep.equals({
      items: [{
        _id: 1,
      }],
      total_count: 1,
      offset: 0,
      limit: 20,
    });
  });
});
