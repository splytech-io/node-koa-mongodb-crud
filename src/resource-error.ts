export namespace ResourceError {
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
    return <any>class {
      constructor(...args: any[]) {
        return new Error(code, ...args);
      }

      static code() {
        return code;
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

    return e.type === 'ResourceError';
  }

  /**
   *
   */
  export class Error extends global.Error {
    code: string;
    description?: string;
    info?: any;
    type = 'ResourceError';

    /**
     *
     * @param {string} code
     * @param {string} description
     */
    constructor(code: string, description?: string) {
      super(`ResourceError: ${code}`);

      this.code = code;
      this.description = description;
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
}
