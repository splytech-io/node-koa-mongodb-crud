import { ResourceError } from './resource-error';
import { expect } from 'chai';

describe('resource-error', () => {
  it('should return error code', async () => {
    expect(ResourceError.DUPLICATE_RECORD.code).to.be.a('function');
    expect(ResourceError.DUPLICATE_RECORD.code()).to.be.a('string');
    expect(ResourceError.DUPLICATE_RECORD.code()).to.be.equals('DUPLICATE_RECORD');
  });
  it('should be instanceof ResourceError.DUPLICATE_RECORD', async () => {
    expect(new ResourceError.DUPLICATE_RECORD() instanceof ResourceError.DUPLICATE_RECORD).to.be.equals(true);
  });
  it('should be instanceof ResourceError.Error', async () => {
    expect(new ResourceError.DUPLICATE_RECORD() instanceof ResourceError.Error).to.be.equals(true);
  });
  it('should detect if object is typeof ResourceError', async () => {
    expect(ResourceError.isError(new ResourceError.DUPLICATE_RECORD())).to.be.equals(true);
  });
  it('should detect that object is not typeof ResourceError', async () => {
    expect(ResourceError.isError(new Error())).to.be.equals(false);
    expect(ResourceError.isError(null)).to.be.equals(false);
    expect(ResourceError.isError(undefined)).to.be.equals(false);
    expect(ResourceError.isError(NaN)).to.be.equals(false);
  });
});
