const express = require('express')

const router = express.Router()

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
} = require('../../models/contacts');

const { schema } = require('../../validators/validate');

router.get('/', async (req, res, next) => {
    try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);

    // if (!contact) {
    //   return res.status(404).json({ message: 'Contact not found' });
    // }

   if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  
 } catch (error) {
   next(error);
 }
})

router.post('/', async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);

    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({ message:`missing required ${error} field`})
    }

  } catch (error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);

    if (result) {
      res.status(200).json({ message: 'contact deleted' });
    } else {
      res.status(400).json({ message: 'Not found' });
    }
  
    
  } catch (error) {
     next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({ message:`missing required ${error} field`})
    }

    const updatedContact = await updateContact(req.params.id, req.body);
    
    updatedContact ? res.status(200).json(updatedContact):   res.status(404).json({ message: 'Not found' });

    
  } catch (error) {
     next(error);
  }
})

module.exports = router
