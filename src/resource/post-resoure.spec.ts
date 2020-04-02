import { expect, use } from 'chai';
import { J } from '../joi';
import { ResourceError } from '../resource-error';
import { createCollection, createContext } from '../test-helpers';
import { PostResource } from './post-resource';
import chaiAsPromised = require('chai-as-promised');
import sinon = require('sinon');

use(chaiAsPromised);

describe('post-resource', () => {
  const sandbox = sinon.createSandbox();
  const validation = J.object({
    name: J.string(),
  });
  const cast = {};

  afterEach(() => {
    sandbox.restore();
  });

  it('should fail request validation', async () => {
    const collection = createCollection();
    const middleware = PostResource.create(collection, {
      validation,
      cast,
    });
    const ctx = createContext();

    await expect(middleware(ctx))
      .to.eventually.be.rejectedWith(ResourceError.VALIDATION_FAILURE);
  });
  it('should succeed', async () => {
    const collection = createCollection();
    const middleware = PostResource.create(collection, {
      validation,
      cast,
    });
    const ctx = createContext({
      body: {
        name: 'john',
      },
    });

    await middleware(ctx);

    expect(ctx.status).to.equals(201);
  });
  it('should run preProcess', async () => {
    const collection = createCollection();
    const preProcess = sinon.spy();
    const middleware = PostResource.create(collection, {
      validation,
      cast,
      preProcess: preProcess,
    });
    const ctx = createContext({
      body: {
        name: 'john',
      },
    });

    await middleware(ctx);

    expect(ctx.status).to.equals(201);
    expect(preProcess.callCount).to.equals(1);
  });
  it('should run documentFormatter', async () => {
    const collection = createCollection();

    const documentFormatter = sinon.stub().callsFake(() => {
      return { some: true };
    });

    const insertOneStub = sandbox.stub(collection, 'insertOne')
      .returns(Promise.resolve<any>({}));

    const middleware = PostResource.create(collection, {
      validation,
      cast,
      documentFormatter: documentFormatter,
    });
    const ctx = createContext({
      body: {
        name: 'john',
      },
    });

    await middleware(ctx);

    expect(ctx.status).to.equals(201);
    expect(documentFormatter.callCount).to.equals(1);
    expect(insertOneStub.callCount).to.equals(1);
    expect(insertOneStub.getCall(0).args[0]).to.deep.equals({
      some: true,
    });
  });
  it('should throw DUPLICATE_RECORD', async () => {
    const collection = createCollection();
    const error = Object.assign(new Error(), { code: 11000 });
    const insertOneStub = sandbox.stub(collection, 'insertOne').returns(Promise.reject(error));
    const middleware = PostResource.create(collection, {
      validation,
      cast,
    });
    const ctx = createContext({
      body: {
        name: 'John',
      },
    });

    await expect(middleware(ctx))
      .to.eventually.be.rejectedWith(ResourceError.DUPLICATE_RECORD);

    expect(insertOneStub.callCount).to.equals(1);
  });
})
;
