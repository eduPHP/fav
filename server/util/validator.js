import { validateAll } from 'indicative/validator.js'

export class Validator {
    constructor(rules) {
        this.rules = rules
        this.messages = {
            required(field, validation, args) {
                return `${field} is required.` 
            },
            url(field, validation, args) {
                return `${field} format is invalid.` 
            },
        }
    }

    validate(req) {
        return validateAll(req.body, this.rules, this.messages)        
    }
}