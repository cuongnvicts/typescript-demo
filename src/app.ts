import dotenv from 'dotenv';
// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env' });

import express, { NextFunction } from 'express';
import exphbs from 'express-handlebars';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as appConfig from './common/app-config';

import { check, validationResult } from 'express-validator/check';
import router from './route/api-route';

/**
 * Create Express server.
 */
const app = express();

// view engine
const hbs = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    demoHelperHbs: (text: string) => {
      return 'This is text ' + text;
    }
  }
});
/**
 * View engine using
 */
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Primary app routes.
 */
app.use('/', router);

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3333);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

/**
 * Create connection to DB using configuration provided in
 * appconfig file
 */
createConnection(appConfig.dbOptions).then(async connection => {
  console.log('Connected to DB');

}).catch(error => console.log('TypeORM connection error: ', error));

module.exports = app;