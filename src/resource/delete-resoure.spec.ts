import { RequestValidation } from '@splytech-io/request-validation';
import { expect, use } from 'chai';
import { ResourceError } from '../resource-error';
import { createCollection, createContext } from '../test-helpers';
import { DeleteResource } from './delete-resource';
import chaiAsPromised = require('chai-as-promised');
import sinon = require('sinon');

use(chaiAsPromised);

describe('delete-resource', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  it('should fail request validation', async () => {
    const collection = createCollection();
    const middleware = DeleteResource.create(collection);
    const ctx = createContext();

    await expect(middleware(ctx))
      .to.eventually.be.rejectedWith(RequestValidation.Error);
  });
  it('should succeed', async () => {
    const collection = createCollection();
    const middleware = DeleteResource.create(collection);
    const ctx = createContext({
      params: {
        id: '0'.repeat(24),
      },
    });

    await middleware(ctx);

    expect(ctx.status).to.equals(204);
  });
  it('should throw NOT_FOUND', async () => {
    const collection = createCollection();

    const deleteOneStub = sandbox.stub(collection, 'deleteOne').returns({
      deletedCount: 0,
    });

    const middleware = DeleteResource.create(collection);
    const ctx = createContext({
      params: {
        id: '0'.repeat(24),
      },
    });

    await expect(middleware(ctx))
      .to.eventually.be.rejectedWith(ResourceError.NOT_FOUND);

    expect(deleteOneStub.callCount).to.equals(1);
  });
});
