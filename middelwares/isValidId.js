const { Types } = require('mongoose');
const Contact = require('../models/contact');
const { catchAsync, handleError } = require('../utils');


const checkUserExistsById = async (id) => {
  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw handleError(404, 'User not found..');

  const userExists = await Contact.exists({ _id: id });

  if (!userExists) throw handleError (404, 'User not found..');
};

exports.checkUserId = catchAsync(async (req, res, next) => {
  await checkUserExistsById(req.params.id);

  next();
});