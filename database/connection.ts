import { ConnectionOptions, createConnection } from 'typeorm';
import { app } from '../config';

import testConfig from './tests.config';
import devConfig from './development.config';

createConnection(
  app.env === 'test'
    ? (testConfig as ConnectionOptions)
    : (devConfig as ConnectionOptions),
);
