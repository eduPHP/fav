import { withIronSession, Handler } from 'next-iron-session'

export default function withSession(handler: Handler) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: '@edu/rss-reader',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production',
    },
  })
}
