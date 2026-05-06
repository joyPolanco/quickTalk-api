import { Router  } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { RateProtection } from "../middleware/rateLimiting.middleware.js";
import { createContact, deleteContact, getAllContacts , editContact} from "../controllers/contacts.controller.js";
import { validate } from "../middleware/validator.middleware.js";
import { createContactSchema, editContactValidationSchema } from "../validation/contact.validation.js";
const router= Router();
/** */
router.use(authorize);

router.get('/', getAllContacts);
router.post('/add', validate(createContactSchema), createContact);
router.delete('/:id/remove', deleteContact);
router.put('/:id/edit', validate(editContactValidationSchema), editContact);




export default router;