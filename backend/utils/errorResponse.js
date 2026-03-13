class ErrorResponse extends Error {
  constructor(message, statusCode, errorCode = 'API_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

module.exports = ErrorResponse;
