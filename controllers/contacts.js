const Contact = require("../models/contacts");
const { handleError, catchAsync } = require("../utils");

exports.getContacts = catchAsync(async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 5, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner };
  if (favorite === "true") {
    filter.favorite = true;
  }
  const contacts = await Contact.find(filter, "-createAt -updateAt", {
    favorite: true,
    skip,
    limit,
  }).populate("owner", "name email");
  res.status(200).json(contacts);
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
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
});

exports.deleteContactById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw handleError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
});

exports.updateContactById = catchAsync(async (req, res) => {
  const { id } = req.params;

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
  const updateStatusContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updateStatusContact) {
    throw handleError(404, "Not found");
  }
  res.status(200).json(updateStatusContact);
});