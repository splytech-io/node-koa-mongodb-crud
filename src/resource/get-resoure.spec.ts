import { expect, use } from 'chai';
import { ResourceError } from '../resource-error';
import { createCollection, createContext } from '../test-helpers';
import { GetResource } from './get-resource';
import chaiAsPromised = require('chai-as-promised');
import sinon = require('sinon');

use(chaiAsPromised);

describe('get-resource', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  it('should fail request validation', async () => {
    const collection = createCollection();
    const middleware = GetResource.create(collection);
    const ctx = createContext();

    await expect(middleware(ctx))
      .to.eventually.be.rejectedWith(ResourceError.VALIDATION_FAILURE);
  });
  it('should succeed', async () => {
    const collection = createCollection();
    const findOneStub = sandbox.stub(collection, 'findOne').returns({
      object: true,
    });
    const middleware = GetResource.create(collection);
    const ctx = createContext({
      params: {
        id: '0'.repeat(24),
      },
    });

    await middleware(ctx);

    expect(ctx.body).to.deep.equals({
      object: true,
    });
    expect(findOneStub.callCount).to.equals(1);
  });
  it('should throw NOT_FOUND', async () => {
    const collection = createCollection();
    const findOneStub = sandbox.stub(collection, 'findOne').returns(null);
    const middleware = GetResource.create(collection);
    const ctx = createContext({
      params: {
        id: '0'.repeat(24),
      },
    });

    await expect(middleware(ctx))
      .to.eventually.be.rejectedWith(ResourceError.NOT_FOUND);

    expect(findOneStub.callCount).to.equals(1);
  });
});
