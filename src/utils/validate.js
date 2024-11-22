const validate = require("validator")

function validateSignup(req){
    const userKeys = Object.keys(req.body);
    const requiredField = ["name", "phone", "email", "password"];
    const missingField = requiredField.filter((f) => !userKeys.includes(f));
    if (missingField.length > 0) {
      throw new Error(`missing required field: ${missingField}`);
    }
  
}

module.exports = {validateSignup}