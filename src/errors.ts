/**
 * Base error class for all zwon-date-function errors
 */
export class DateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DateError";
  }
}

/**
 * Error thrown when an invalid date format is encountered
 */
export class InvalidDateFormatError extends DateError {
  constructor(dateString: string, supportedFormats?: string[]) {
    const message = supportedFormats
      ? `Unsupported date format: ${dateString}. Supported formats: ${supportedFormats.join(", ")}`
      : `Unsupported date format: ${dateString}`;
    super(message);
    this.name = "InvalidDateFormatError";
  }
}

/**
 * Error thrown when an invalid date value is encountered
 */
export class InvalidDateError extends DateError {
  constructor(dateString: string) {
    super(`Invalid date: ${dateString}`);
    this.name = "InvalidDateError";
  }
}

/**
 * Error thrown when an unsupported format type is used
 */
export class UnsupportedFormatTypeError extends DateError {
  constructor(formatType: string, supportedTypes?: string[]) {
    const message = supportedTypes
      ? `Unsupported format type: ${formatType}. Supported types: ${supportedTypes.join(", ")}`
      : `Unsupported format type: ${formatType}`;
    super(message);
    this.name = "UnsupportedFormatTypeError";
  }
}

/**
 * Error thrown when a required parameter is missing
 */
export class MissingParameterError extends DateError {
  constructor(parameterName: string) {
    super(`Missing required parameter: ${parameterName}`);
    this.name = "MissingParameterError";
  }
}

/**
 * Error thrown when an incompatible operation is attempted
 */
export class IncompatibleOperationError extends DateError {
  constructor(operation: string, reason: string) {
    super(`Incompatible operation: ${operation}. Reason: ${reason}`);
    this.name = "IncompatibleOperationError";
  }
}
