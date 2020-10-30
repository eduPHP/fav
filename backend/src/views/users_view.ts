import User from '../models/User'

export default {
    render(user: User) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        }
    },

    renderMany(users: User[]) {
        return users.map(user => this.render(user))
    }
}
