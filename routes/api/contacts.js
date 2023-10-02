const express = require("express");
const router = express.Router();

const contacts = require("../../controllers/contacts");

const { isValidId,validateBody } = require("../../middelwares");
const {  isValidContatc, isValidFavorite } = require("../../validator/validate");


router.get("/", contacts.getContacts);

router.get("/:id", isValidId.checkUserId, contacts.getContactById);

router.post("/", validateBody(isValidContatc), contacts.addContact);

router.delete("/:id", isValidId.checkUserId, contacts.deleteContactById);

router.put("/:id", validateBody(isValidContatc), isValidId.checkUserId,  contacts.updateContactById);

router.patch("/:id/favorite", isValidId.checkUserId, validateBody(isValidFavorite), contacts.updateFavorite);

module.exports = router;
