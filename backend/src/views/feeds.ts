import Feed from '../models/Feed'
import users_view from "./users_view";

export default {
    render(feed: Feed) {
        return {
            id: feed.id,
            name: feed.name,
            url: feed.url,
            active: feed.active,
            user: feed.user && {
                id: feed.user.id,
                name: feed.user.name,
                email: feed.user.email,
            }
        }
    },

    renderMany(feeds: Feed[]) {
        return feeds.map(feed => this.render(feed))
    }
}
