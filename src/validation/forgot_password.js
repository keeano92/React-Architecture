import Validator from 'validator'
import isEmpty from 'is-empty'

//Data should be email and Password(unhashed)
export function validateForgotPassword(data) {
    let errors = {}

    //Convert String for Validator
    data.email = !isEmpty(data.email) ? data.email : ""
    data.password = !isEmpty(data.password) ? data.pasword : ""
    data.password2 = !isEmpty(data.password2) ? data.password2 : ""

    //Checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required"
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid"
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required"
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "confirm password field is required"
    }

    if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = "Password must be at least 6 characters"
    }

    if(!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}