import { ObjectID } from 'bson';
import { expect, use } from 'chai';
import { createCollection, createContext } from '../test-helpers';
import { AggregateResource } from './aggregate-resource';
import chaiAsPromised = require('chai-as-promised');
import sinon = require('sinon');

use(chaiAsPromised);

describe('aggregate-resource', () => {
  const sandbox = sinon.createSandbox();
  const cast = {
    _id: ObjectID,
  };

  afterEach(() => {
    sandbox.restore();
  });

  it('should succeed', async () => {
    const docs: any[] = [{
      _id: 'one',
    }, {
      _id: 'two',
    }];
    const collection = createCollection();
    const aggregateStub = sinon.stub(collection, 'aggregate').returns({
      next: () => docs.shift(),
    });
    const middleware = AggregateResource.create(collection, {
      cast,
    });
    const ctx = createContext({
      query: {
        pipeline: JSON.stringify([{
          $match: {
            _id: '123456781234567812345678',
          },
        }]),
      },
    });

    await middleware(ctx);

    expect(ctx.status).to.equals(200);
    expect((<any>ctx).result.res).to.equals('[{"_id":"one"},{"_id":"two"}]');
    expect(aggregateStub.getCall(0).args[0]).to.deep.equals([{
      '$match': { _id: new ObjectID('123456781234567812345678') },
    }]);
  });
});
