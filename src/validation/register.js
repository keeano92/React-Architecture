import Validator from 'validator'
import isEmpty from 'is-empty'

export function validateRegistrationInput(data) {
    let errors = {};

    //Convert to empty string for validator
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    //Perform Checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required"
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required"
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid, please use a valid email"
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required"
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required"
    }

    if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = "Password must be at least 6 characters"
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
} 