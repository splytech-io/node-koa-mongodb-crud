import { expect, use } from 'chai';
import { J } from '../joi';
import { ResourceError } from '../resource-error';
import { createCollection, createContext } from '../test-helpers';
import { PatchResource } from './patch-resource';
import chaiAsPromised = require('chai-as-promised');
import sinon = require('sinon');

use(chaiAsPromised);

describe('patch-resource', () => {
  const sandbox = sinon.createSandbox();
  const validation = J.object();
  const cast = {};

  afterEach(() => {
    sandbox.restore();
  });

  it('should fail request validation', async () => {
    const collection = createCollection();
    const middleware = PatchResource.create(collection, {
      validation,
      cast,
    });
    const ctx = createContext();

    await expect(middleware(ctx))
      .to.eventually.be.rejectedWith(ResourceError.VALIDATION_FAILURE);
  });
  it('should succeed', async () => {
    const collection = createCollection();
    const updateOneStub = sandbox.stub(collection, 'updateOne').returns(Promise.resolve({
      matchedCount: 1,
    }));
    const middleware = PatchResource.create(collection, {
      validation,
      cast,
    });
    const ctx = createContext({
      params: {
        id: '0'.repeat(24),
      },
    });

    await middleware(ctx);

    expect(ctx.status).to.equals(204);
    expect(updateOneStub.callCount).to.equals(1);
  });
  it('should throw NOT_FOUND', async () => {
    const collection = createCollection();
    const updateOneStub = sandbox.stub(collection, 'updateOne').returns(Promise.resolve({
      matchedCount: 0,
    }));
    const middleware = PatchResource.create(collection, {
      validation,
      cast,
    });
    const ctx = createContext({
      params: {
        id: '0'.repeat(24),
      },
    });

    await expect(middleware(ctx))
      .to.eventually.be.rejectedWith(ResourceError.NOT_FOUND);

    expect(updateOneStub.callCount).to.equals(1);
  });
  it('should throw DUPLICATE_RECORD', async () => {
    const collection = createCollection();
    const error = Object.assign(new Error(), { code: 11000 });
    const updateOneStub = sandbox.stub(collection, 'updateOne').returns(Promise.reject(error));
    const middleware = PatchResource.create(collection, {
      validation,
      cast,
    });
    const ctx = createContext({
      params: {
        id: '0'.repeat(24),
      },
    });

    await expect(middleware(ctx))
      .to.eventually.be.rejectedWith(ResourceError.DUPLICATE_RECORD);

    expect(updateOneStub.callCount).to.equals(1);
  });
});
