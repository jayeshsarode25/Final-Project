const { body, validationResult } = require("express-validator");

const responseWithValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerUserValidator = [
  body("username")
    .isString()
    .withMessage("username must be a string")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullName.firstName")
    .isString()
    .withMessage("First name must be a string")
    .notEmpty()
    .withMessage("First name is required"),
  body("fullName.lastName")
    .isString()
    .withMessage("Last name must be a string")
    .notEmpty()
    .withMessage("Last name is required"),
  body("role")
    .optional()
    .isIn(["user", "seller"])
    .withMessage("Role must be either 'user' or 'seller'"),
  responseWithValidationErrors,
];

const loginUserValidator = [
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("username")
    .optional()
    .isString()
    .withMessage("username must be a string"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req, res, next) => {
    if (!req.body.email && !req.body.username) {
      return res
        .status(400)
        .json({ message: "Either email or username is required" });
    }
    responseWithValidationErrors(req, res, next);
  },
];

const addUserAddressValidator = [
  body("street")
    .isString()
    .withMessage("Street must be a string")
    .notEmpty()
    .withMessage("Street is required"),
  body("city")
    .isString()
    .withMessage("City must be a string")
    .notEmpty()
    .withMessage("City is required"),
  body("state")
    .isString()
    .withMessage("State must be a string")
    .notEmpty()
    .withMessage("State is required"),
  body("pincode")
    .isString()
    .withMessage("Pincode must be a string")
    .notEmpty()
    .withMessage("Pincode is required"),
  body("country")
    .isString()
    .withMessage("Country must be a string")
    .notEmpty()
    .withMessage("Country is required"),
  body("isDefault")
  .isBoolean()
  .withMessage("isDefault must be a boolean"),
  responseWithValidationErrors,
];

module.exports = {
  registerUserValidator,
  loginUserValidator,
  addUserAddressValidator,
};
