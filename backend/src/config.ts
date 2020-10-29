import { resolve, join } from "path"
import { config } from "dotenv"

config({ path: resolve(join(__dirname, "..", ".env")) })

export const app = {
    port: process.env.SERVER_PORT
}

export default {
    app
}
