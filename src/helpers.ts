import { ResourceError } from './resource-error';

export namespace ResourceHelpers {
  const DUPLICATE_KEY = 11000;

  /**
   *
   * @param e
   */
  export function handleDuplicateRecordError(e: any): never {
    if (e.code === DUPLICATE_KEY) {
      throw new ResourceError.DUPLICATE_RECORD(`${e.name}: ${e.message}`);
    }

    throw e;
  }
}
