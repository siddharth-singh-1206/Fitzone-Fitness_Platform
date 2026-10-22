const { validationResult } = require('express-validator');

/**
 * validate — Runs express-validator's validationResult and short-circuits
 * the request with a 400 response if any validation rules failed.
 *
 * Usage: place after an array of check() rules in a route definition.
 *   router.post('/', [check(...), check(...)], validate, controllerFn)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors
        .array()
        .map((e) => e.msg)
        .join(', '),
      errors: errors.array(),
    });
  }
  next();
};

module.exports = validate;
