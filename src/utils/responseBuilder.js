const buildResponse = (
  data,
  message = "Data Received",
  status = "success",
  meta = {}
) => {
  return {
    data: data,
    message: message,
    status: status,
    meta: meta,
    error: null,
  };
};

const buildError = (err, errorCode = 400) => {
  return {
    data: null,
    message: err.message,
    status: "failed",
    error: { message: err.message, error_code: errorCode },
    meta: {},
  };
};

module.exports = {
  buildResponse,
  buildError,
};
