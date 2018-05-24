import { expect, use } from 'chai';
import { createCollection, createContext } from '../test-helpers';
import { ListResources } from './list-resources';
import chaiAsPromised = require('chai-as-promised');
import sinon = require('sinon');

use(chaiAsPromised);

describe('list-resources', () => {
  const sandbox = sinon.createSandbox();
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
  it('should preProcess options', async () => {
    const collection = createCollection();
    sandbox.stub(collection, 'count').returns(1);
    const aggregateStub = sandbox.stub(collection, 'aggregate').returns({
      toArray: async () => ([{
        _id: 1,
      }]),
    });
    const middleware = ListResources.create(collection, {
      cast,
      preProcess: (options) => {
        options.forceFilter = { group: 'admin' };
      },
    });
    const ctx = createContext({
      params: {
        id: '0'.repeat(24),
      },
    });

    await middleware(ctx);

    expect(aggregateStub.getCall(0).args[0][0].$match).to.deep.equals({
      group: 'admin',
    });

    expect(ctx.body).to.deep.equals({
      items: [{
        _id: 1,
      }],
      total_count: 1,
      offset: 0,
      limit: 20,
    });
  });
  it('should postProcess result', async () => {
    const collection = createCollection();
    sandbox.stub(collection, 'count').returns(1);
    const aggregateStub = sandbox.stub(collection, 'aggregate').returns({
      toArray: async () => ([{
        _id: 1,
      }]),
    });
    const middleware = ListResources.create(collection, {
      cast,
      preProcess: (options) => {
        options.forceFilter = { group: 'admin' };
      },
      postProcess: (result) => {
        expect(result.filter).to.deep.equals({
          group: 'admin',
        });
      },
    });
    const ctx = createContext({
      params: {
        id: '0'.repeat(24),
      },
    });

    await middleware(ctx);

    expect(aggregateStub.getCall(0).args[0][0].$match).to.deep.equals({
      group: 'admin',
    });

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
