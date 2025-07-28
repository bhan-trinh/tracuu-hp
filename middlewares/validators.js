const { header, validationResult } = require ('express-validator');
const publicPaths = require('../routes/public/routes')

exports.myRequestHeaders = [
  header('authorization')
    .exists({ checkFalsy: true })
    .withMessage("Missing Authorization Header") // you can specify the message to show if a validation has failed
    .bail() // not necessary, but it stops execution if previous validation failed
    //you can chain different validation rules 
    .contains("Bearer")
    .withMessage("Authorization Token is not Bearer")
];

exports.validateRequest = (req, res, next) => {
  if (publicPaths.paths.includes(req.path)) {
      next(); // Skip auth
  }
  const validationErrors = validationResult(req);
  const errorMessages = [];

  for (const e of validationErrors.array()) {
    errorMessages.push(e.msg);
  }

  if (!validationErrors.isEmpty()) {
    return res.status(403).json({"errors": errorMessages });
  }
  next();
}