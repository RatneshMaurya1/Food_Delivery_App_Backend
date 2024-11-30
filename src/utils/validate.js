const validate = require("validator");

function validateSignup(req) {
  const userKeys = Object.keys(req.body);
  const requiredField = ["name", "phone", "email", "password"];
  const missingField = requiredField.filter((f) => !userKeys.includes(f));
  if (missingField.length > 0) {
    throw new Error(`missing required field: ${missingField}`);
  }
}

function validateProfileEdit(data) {
  const { gender, fullName, country } = data;

  if (!gender && !fullName && !country) {
    return "At least one field is required to update.";
  }

  if (
    gender &&
    !["male", "female", "others"].includes(gender.trim().toLowerCase())
  ) {
    return "Gender must be 'male', 'female', or 'others'.";
  }

  if (fullName && fullName.trim().length < 2) {
    return "Full name must be at least 2 characters long.";
  }

  if (country && country.trim().length < 2) {
    return "Country must be at least 2 characters long.";
  }

  return null; 
}

module.exports = {
  validateSignup,
  validateProfileEdit,
};
