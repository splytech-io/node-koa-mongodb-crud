import { RequestValidation } from '@splytech-io/request-validation';
import { ResourceError } from './resource-error';
import { Context } from './types';

export namespace MyRequestValidation {
  export function validate<T>(
    ctx: Context,
    rules: RequestValidation.Rules,
    options: RequestValidation.Options = {},
  ): T {
    try {
      return RequestValidation.validate<T>(ctx, rules, options);
    } catch (e) {
      if (e instanceof RequestValidation.Error) {
        throw new ResourceError.VALIDATION_FAILURE('RequestValidation.Error').setInfo(e);
      }

      throw e;
    }
  }
}
