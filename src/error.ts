export enum ErrorType {
  MissingKey = "MISSING_KEY",
  MissingValue = "MISSING_VALUE",
  InvalidType = "INVALID_TYPE",
}

export class CustomError extends Error {
  public override message: string;
  public type: ErrorType;

  public constructor(message: string, type: ErrorType) {
    super();
    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.type = type;
    this.name = type;
  }
}
