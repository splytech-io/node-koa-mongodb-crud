export namespace ResourceError {

  /**
   *
   */
  export class Error extends global.Error {
    code: string;
    info?: any;
    name = 'ResourceError';

    /**
     *
     * @param {string} code
     * @param {string} message
     */
    constructor(code: string, message?: string) {
      super(`${code}: ${message}`);

      this.code = code;
    }

    /**
     *
     * @param info
     * @returns {this}
     */
    setInfo(info: any) {
      this.info = info;

      return this;
    }

  }

  export const NOT_FOUND = create('NOT_FOUND');
  export const DUPLICATE_RECORD = create('DUPLICATE_RECORD');
  export const VALIDATION_FAILURE = create('VALIDATION_FAILURE');

  export interface Constructor {
    new (description?: string, info?: any): Error;

    code: () => string;
  }

  /**
   *
   * @param {string} code
   * @returns {ResourceError.Constructor}
   */
  function create(code: string): Constructor {
    return <any>class extends Error {
      constructor(...args: any[]) {
        super(code, ...args);
      }

      static code() {
        return code;
      }

      static [Symbol.hasInstance] (instance: any) {
        return instance instanceof Error && instance.code === code;
      }
    };
  }

  /**
   *
   * @param e
   * @returns {boolean}
   */
  export function isError(e: any): boolean {
    if (typeof e !== 'object') {
      return false;
    }

    return e.name === 'ResourceError';
  }
}
