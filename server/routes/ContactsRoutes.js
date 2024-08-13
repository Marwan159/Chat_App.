const { Router } = require("express");
const ContactsControllers = require("../controllers/ContactsController");
const { isAuth } = require("../middlewares/AuthMiddleware");
const contactsRoutes = Router();

contactsRoutes.post("/search", isAuth, ContactsControllers.searchContacts);

contactsRoutes.get(
  "/get-all-contacts",
  isAuth,
  ContactsControllers.getContactsForDMList
);

contactsRoutes.get(
  "/get-all-contacts-for-channel",
  isAuth,
  ContactsControllers.getAllContacts
);

module.exports = contactsRoutes;
