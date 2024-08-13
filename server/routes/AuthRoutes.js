const { Router } = require("express");
const AuthConroller = require("../controllers/AuthControllers");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const multer = require("multer");
const authRouter = Router();
const uploads = multer({ dest: "uploads/images" });
authRouter.post("/signup", AuthConroller.signup);

authRouter.post("/loggin", AuthConroller.loggin);

authRouter.post("/loggout", AuthMiddleware.isAuth, AuthConroller.loggout);

authRouter.post(
  "/user-update",
  AuthMiddleware.isAuth,
  AuthConroller.updateProfile
);

authRouter.post(
  "/image-update",
  AuthMiddleware.isAuth,
  uploads.single("profile-image"),
  AuthConroller.updateImage
);

authRouter.delete(
  "/image-delete",
  AuthMiddleware.isAuth,
  AuthConroller.deleteImage
);

authRouter.get("/user-info", AuthMiddleware.isAuth, AuthConroller.getUserInfo);
module.exports = authRouter;
