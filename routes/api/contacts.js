const express = require("express");
const router = express.Router();

const contacts = require("../../controllers/contacts");

const { isValidId, validateBody, authenticate } = require("../../middelwares");
const {  isValidContatc, isValidFavorite } = require("../../validator/validate");


router.get("/", authenticate.authenticate,  contacts.getContacts);

router.get("/:id", authenticate.authenticate, isValidId.checkUserId, contacts.getContactById);

router.post("/", authenticate.authenticate, validateBody(isValidContatc), contacts.addContact);

router.delete("/:id", authenticate.authenticate, isValidId.checkUserId, contacts.deleteContactById);

router.put("/:id", authenticate.authenticate, validateBody(isValidContatc), isValidId.checkUserId,  contacts.updateContactById);

router.patch("/:id/favorite", isValidId.checkUserId, validateBody(isValidFavorite), contacts.updateFavorite);

module.exports = router;
