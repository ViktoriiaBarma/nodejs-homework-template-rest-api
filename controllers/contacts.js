const Contact = require("../models/contact");
const {  handleError, catchAsync } = require("../utils");
const { schema } = require("../validator/validate");

exports.getContacts = catchAsync(async (req, res) => {
   const contacts = await Contact.find();
  res.status(200).json(contacts);
  console.log(contacts)
});

exports.getContactById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);
  if (!contact) {
    throw handleError(404, "Contact not found");
  }
  res.status(200).json(contact);
});

exports.addContact = catchAsync(async (req, res) => {

   const { error } = schema(req.body);
    if (error) {
      handleError(400, `${error.message}`);
    }


  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
});

exports.deleteContactById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    // console.log(handleError(404, "Not found"));
    throw handleError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
});

exports.updateContactById = catchAsync(async (req, res) => {
  const { id } = req.params;

   if (Object.keys(req.body).length === 0) {
      return req.route.methods.patch ? handleError(400, "missing field favorite") : handleError(400, "missing fields") 
    }

   const { error } = schema(req.body);
    if (error) {
      handleError(400, `${error.message}`);
    }

  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw handleError(404, "Not found");
  }
  res.status(200).json(updatedContact);
});

exports.updateFavorite = catchAsync(async (req, res) => {
  const { id } = req.params;

 if (Object.keys(req.body).length === 0) {
      return req.route.methods.patch ? handleError(400, "missing field favorite") : handleError(400, "missing fields") 
    }

   const { error } = schema(req.body);
    if (error) {
      handleError(400, `${error.message}`);
    }

  const updateStatusContact  = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updateStatusContact ) {
    throw handleError(404, "Not found");
  }
  res.status(200).json(updateStatusContact );
});

// module.exports = {
//   getAll: catchAsync(getContacts),
// //   getById: catchAsync(getById),
// //   add: catchAsync(add),
// //   deleteById: catchAsync(deleteById),
// //   updateById: catchAsync(updateById),
// //   updateFavorite: catchAsync(updateFavorite),
// };