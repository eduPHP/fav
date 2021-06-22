export default {
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
  from: {
    name: process.env.MAIL_FROM || 'Eduardo Dev',
    email: process.env.MAIL_FROM_EMAIL || 'edu@rdo.blog.br',
  },
}
