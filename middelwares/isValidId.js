const { Types } = require('mongoose');

const Contact = require('../models/contact');
const { handleError } = require('../utils');


exports.checkUserExistsById = async (id) => {
  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw  handleError(404, 'User not found..');

  const userExists = await Contact.exists({ _id: id });

  if (!userExists) throw  handleError(404, 'User not found..');
};