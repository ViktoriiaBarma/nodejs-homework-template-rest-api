const {  handleError } = require("../utils/index");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return req.route.methods.patch ? next(handleError(400, "missing field favorite")) : next(handleError(400, "missing fields"))  
    }
    const { error } = schema(req.body);
    if (error) {
      next(handleError(400, `${error.message}`));
    }
    next();
  };
  return func;
};

module.exports =  validateBody ;