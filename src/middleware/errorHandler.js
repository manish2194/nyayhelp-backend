const { isCelebrateError, Segments } = require("celebrate");
const config = require("../common/config");
const logger = require("../common/logger");
const { AppError } = require("../error");

const errorHandler = function (err, req, res, next) {
  err = err || {};
  let statusCode = 500;

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (isCelebrateError(err)) {
    if (err.details.get(Segments.PARAMS)) {
      const errorParams = err.details.get(Segments.PARAMS);
      return res.status(400).json({
        message: errorParams.details[0].message,
      });
    }
    if (err.details.get(Segments.QUERY)) {
      const errorBody = err.details.get(Segments.QUERY);
      return res.status(400).json({
        message: errorBody.details[0].message,
      });
    }
    if (err.details.get(Segments.BODY)) {
      const errorQuery = err.details.get(Segments.BODY);
      return res.status(400).json({
        message: errorQuery.details[0].message,
      });
    }
  }
  if (["ValidationError", "CastError"].includes(err.name)) {
    statusCode = 400;
  }

  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  const errorBodyData = {
    message: err.errors || err.message || err.details || err,
    code: err.code,
    sentry: res.sentry,
    meta: err.meta || null,
  };

  if (["dev"].includes(config.environment)) {
    errorBodyData["stack"] = err.stack;
    logger.debug(err);
  }
  res.status(statusCode).json(errorBodyData);
};

module.exports = errorHandler;

// const errorHandler = (err, req, res, next) => {
//   // Determine the status code to return
//   const statusCode = err.status || 500; // Default to internal server error

//   // Log the error details to the console (or to a logging service)
//   console.error(`Error [${statusCode}]:`, err.message, err.stack);

//   // Build the response object
//   const response = {
//     status: "error",
//     message: err.message || "Internal Server Error",
//   };

//   // If the environment is in development, include additional error details
//   if (process.env.NODE_ENV === "development") {
//     response.error = {
//       message: err.message,
//       stack: err.stack,
//     };
//   }

//   // Send the response with the determined status code
//   res.status(statusCode).json(response);
// };

// module.exports = errorHandler;
