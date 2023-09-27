const express = require("express");
const router = express.Router();

const contacts = require("../../controllers/contacts");

const {
  isValidId,
} = require("../../middlewares");

router.get("/", contacts.getAllContacts);

router.get("/:id", isValidId, contacts.getContactById);

router.post("/", contacts.addContact);

router.delete("/:id", isValidId, contacts.deleteContactById);

router.put("/:id", isValidId, contacts.updateContactById);

router.patch(
  "/:id/favorite",
  isValidId,
  contacts.updateFavorite
);

module.exports = router;