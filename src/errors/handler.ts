import { ErrorRequestHandler } from 'express'
import {EntityNotFoundError} from 'typeorm/error/EntityNotFoundError'
import { ValidationError } from 'yup'
interface ValidationErrors {
    [key: string]: string[]
}
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if(error instanceof ValidationError) {
        let errors: ValidationErrors = {}

        error.inner.forEach(err => {errors[err.path] = err.errors})

        return res.status(422).json({message: 'Validation fails', errors})
    }

    if (error instanceof EntityNotFoundError) {
        return res.status(404).json({
            message: 'Not Found'
        })
    }

    console.warn(error)

    res.status(500).json({
        message: 'Internal Server Error'
    })
}

export default errorHandler
