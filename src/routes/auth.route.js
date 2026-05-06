import { Router  } from "express";
import { loginSchema, registerSchema, updateProfilePictureSchema, updateProfileSchema } from "../validation/user.validation.js";
import { authorize } from "../middleware/auth.middleware.js";
import { RateProtection } from "../middleware/rateLimiting.middleware.js";
import { HandleLogin, HandleLogout, HandleSignUp, handleUpdateProfile, HandleUpdateProfileImage, verifyPhone } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validator.middleware.js";
const router= Router()

/*
 router.use(RateProtection)
*/
router.post('/signup', validate(registerSchema),HandleSignUp);
router.post('/login', validate(loginSchema),HandleLogin);
router.post('/logout', HandleLogout);
router.put('/profile-picture',authorize, validate(updateProfilePictureSchema), HandleUpdateProfileImage);
router.put('/update-profile',authorize, validate(updateProfileSchema), handleUpdateProfile);
router.get('/check',authorize, (req,res)=>res.status(200).json(req.user));
router.post("/verify-phone", authorize, verifyPhone);


export default router;