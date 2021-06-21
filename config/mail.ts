export default {
  host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.MAIL_PORT || '2525', 10),
  user: process.env.MAIL_USER || '',
  pass: process.env.MAIL_PASS || '',
  secure: Boolean(process.env.MAIL_SECURE) || false,
  from: {
    name: process.env.MAIL_FROM || 'Eduardo Dev',
    email: process.env.MAIL_FROM_EMAIL || 'edu@rdo.blog.br',
  },
}
