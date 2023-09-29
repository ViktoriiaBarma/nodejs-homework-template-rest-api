const express = require("express");
const router = express.Router();

const contacts = require("../../controllers/contacts");

// const {
//   isValidId,
// } = require("../../middelwares");

router.get("/", contacts.getContacts);

router.get("/:id",  contacts.getContactById);

router.post("/", contacts.addContact);

router.delete("/:id", contacts.deleteContactById);

router.put("/:id",  contacts.updateContactById);

router.patch(
  "/:id/favorite",

  contacts.updateFavorite
);

module.exports = router;