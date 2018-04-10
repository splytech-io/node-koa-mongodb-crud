export class ResourceError extends Error {
  static NOT_FOUND = ResourceError.create('NOT_FOUND');
  static DUPLICATE_RECORD = ResourceError.create('DUPLICATE_RECORD');

  static create(code: string) {
    return class extends ResourceError {
      code = code;
      description?: string;

      constructor(description?: string) {
        super(`Resource: ${code}: ${message}`);

        this.description = description;
      }
    }
  }
}
