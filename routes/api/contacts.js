const express = require("express");

const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const { schema } = require("../../validators/validate");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schema(req.body);
    if (error) {
      return res.status(400).json({
        message: `missing required ${error.details[0].path[0]} field`,
      });
    }

    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);

    result
      ? res.status(200).json({ message: "contact deleted" })
      : res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    if (Object.keys(req.body).length < 2) {
      return res.status(400).json({ message: `missing fields` });
    }

    const { error } = schema(req.body);
    if (error) {
      return res
        .status(400)
        .json({
          message: `missing required ${error.details[0].path[0]} field`,
        });
    }

    const updatedContact = await updateContact(req.params.contactId, req.body);

    updatedContact
      ? res.status(200).json(updatedContact)
      : res.status(404).json({ message: "Not found" });

    // if (updatedContact) {
    //   res.status(200).json(updatedContact);
    // } else {
    //   res.status(404).json({ message: 'Not found' });
    // }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
