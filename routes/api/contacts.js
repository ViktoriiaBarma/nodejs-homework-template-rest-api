const express = require("express");
const router = express.Router();

const contacts = require("../../controllers/contacts");

const { isValidId } = require("../../middelwares");

router.get("/", contacts.getContacts);

router.get("/:id", isValidId.checkUserId, contacts.getContactById);

router.post("/", contacts.addContact);

router.delete("/:id", isValidId.checkUserId, contacts.deleteContactById);

router.put("/:id", isValidId.checkUserId, contacts.updateContactById);

router.patch("/:id/favorite", isValidId.checkUserId, contacts.updateFavorite);

module.exports = router;
