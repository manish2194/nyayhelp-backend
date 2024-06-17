class AppError extends Error {
  constructor(message, errorCode) {
    super(message);
    if (message) {
      this.message = message;
    }
    if (errorCode) {
      this.code = errorCode;
    }
  }

  get statusCode() {
    return 500;
  }
}

class BadRequest extends AppError {
  get message() {
    return "bad request";
  }
  get statusCode() {
    return 400;
  }
}
class UnauthorizedRequest extends AppError {
  get message() {
    return "unaithorized request";
  }
  get statusCode() {
    return 401;
  }
}

class ForbiddenRequest extends AppError {
  get message() {
    return "forbidden request";
  }
  get statusCode() {
    return 403;
  }
}
class NotFound extends AppError {
  get message() {
    return "not found";
  }
  get statusCode() {
    return 404;
  }
}
class UnprocessableEntity extends AppError {
  get message() {
    return "unprocessable entity";
  }
  get statusCode() {
    return 422;
  }
}

class TooManyErrors extends AppError {
  get message() {
    return "Too many requests";
  }
  get statusCode() {
    return 429;
  }
}
class ServiceUnavailable extends AppError {
  get message() {
    return "Service Unavailables";
  }
  get statusCode() {
    return 503;
  }
}
class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.errors = errors;
    this.code = 16100;
  }
}

module.exports = {
  AppError,
  BadRequest,
  UnauthorizedRequest,
  ForbiddenRequest,
  NotFound,
  UnprocessableEntity,
  TooManyErrors,
  ValidationError,
  ServiceUnavailable,
};
