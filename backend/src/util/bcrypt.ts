import bcrypt from 'bcrypt'

const rounds = 10

export default {
    async encrypt(str: string) {
        let hashedStr = null

        await bcrypt.hash(str, rounds).then(function(hash) {
            hashedStr = hash
        });

        if (!hashedStr) {
            throw 'hash error'
        }

        return hashedStr
    },

    async compare(hashedStr: string, str: string) {
        return await bcrypt.compare(str, hashedStr)
    }
}
