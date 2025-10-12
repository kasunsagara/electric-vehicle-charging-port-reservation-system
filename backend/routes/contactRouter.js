import express from 'express';
import { submitContactForm, getAllContacts, deleteContact } from '../controllers/contactController.js';

const contactRouter = express.Router();

contactRouter.post("/submit", submitContactForm);
contactRouter.get("/all", getAllContacts);
contactRouter.delete("/:name", deleteContact);


export default contactRouter;
