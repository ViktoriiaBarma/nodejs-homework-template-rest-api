const isValidId = require("./isValidId");
const validateBody = require('./validBody')
const authenticate = require('./auth')
const loading = require("./loading");

module.exports = {
  isValidId,
  validateBody,
  authenticate,
  loading,
};