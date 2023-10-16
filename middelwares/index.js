const isValidId = require("./isValidId");
const validateBody = require('./validBody')
const authenticate = require('./auth')
const upload = require('./upload');

module.exports = {
  isValidId,
  validateBody,
  authenticate,
  upload,
};