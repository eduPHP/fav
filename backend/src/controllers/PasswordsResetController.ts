import {Request, Response} from 'express'
import {getRepository} from 'typeorm'

import PasswordReset from "../models/PasswordReset"
import createToken from "../util/createToken"
import users_view from "../views/users_view"
import mailer from "../util/mailer"
import bcrypt from "../util/bcrypt"
import {app} from '../util/config'
import User from "../models/User"
import * as Yup from "yup";

interface RequestProps {
    email: string
}

export default {
    async store(req: Request, res: Response) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            base: Yup.string().nullable(),
        })
        const data = await schema.validate(req.body, {abortEarly: false}) as RequestProps
        const userRepo = getRepository(User)
        const passwordResetRepo = getRepository(PasswordReset)
        const user = await userRepo.findOne(data)
        if (!user) {
            return res.status(422).json({errors: {email: ['Não foi possível enviar o email.']}})
        }

        const token = Math.random().toString(36).substring(3)
        const passwordReset = passwordResetRepo.create({
            user: user,
            token: await bcrypt.encrypt(token),
        })
        await passwordResetRepo.save(passwordReset)

        const messageHtml = `
            <p>Clique no link a seguir para alterar sua senha</p>
            <a href="${app.frontend}/admin/forgot/${passwordReset.id}.${token}">Altere sua senha.</a>
        `
        const messageText = `
             Acesse o link a seguir para alterar sua senha:
             ${app.frontend}/admin/forgot/${passwordReset.id}.${token}
         `
        const result = await mailer.send(user.email, 'Recuperação de senha', messageText, messageHtml)

        return res.json({sent: result.rejected.length === 0})
    },

    async update(req: Request, res: Response) {
        const {password, token} = req.body
        const [resetId, rawToken] = token.split('.')
        const userRepo = getRepository(User)
        const passwordResetRepo = getRepository(PasswordReset)

        const passwordReset = await passwordResetRepo.findOne({id: resetId}, { relations: ['user'] })
        // compara token com token gravado
        if (!passwordReset || passwordReset.used_at || !await bcrypt.compare(passwordReset.token, rawToken)) {
            return res.status(400).json({
                errors: {password: 'Não foi possível resetar sua senha.'}
            })
        }

        // atualiza senha
        const user = passwordReset.user
        user.password = await bcrypt.encrypt(password)
        await userRepo.save(user)
        // marca token como usado
        passwordReset.used_at = new Date()
        await passwordResetRepo.save(passwordReset)

        return res.json({
            user: users_view.render(user),
            token: createToken(user)
        })
    },

}
