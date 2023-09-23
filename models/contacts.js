const fs = require("fs/promises");
const uuid = require("uuid").v4;
const path = require("path");

const contactsPath = path.join(__dirname, 'contacts.json')


const writeContacts = async (contacts) => {
  return await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);

  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contactId === contact.id);
console.log(contact)
  return contact || null;
};


const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);

  await writeContacts(contacts);

  return result;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: uuid(),
    ...body,
  };

  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
};

const updateContact = async (contactId, body) => {


     const contacts = await listContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (contactIndex === -1) return null;

  contacts[contactIndex] = { contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[contactIndex];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
