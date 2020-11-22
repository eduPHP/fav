import app from './app'
import config from './util/config'

app.listen(config.app.port, () =>
  console.log(`Server is ready at http://localhost:${config.app.port}`),
)
