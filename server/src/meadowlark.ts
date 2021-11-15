import express, { Application } from 'express';
import path from 'path';
import https from 'https';
import bodyParser from 'body-parser';
import cookieParser  from 'cookie-parser';
import expressSession from 'express-session';
import morgan from "morgan";
import fs from 'fs';
import cors from 'cors';
// import multiparty from 'multiparty';
// import nodemailer from 'nodemailer';

import './db';
import * as api from './lib/api';
import { createAuth } from './lib/auth';

import { credentials } from './config';

export const app: Application = express();
const PORT = process.env.PORT || 3033;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}));

// security configuration
const auth = createAuth(app, {
  providers: credentials.authProviders,
  successRedirect: '/account',
  failureRedirect: '/unauthorized',
})

auth.init();
auth.registerRoutes();

switch (app.get('env')) {
  case 'development': {
    app.use(morgan('dev'));
    break;
  }
  case 'production': {
    const stream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' })
    app.use(morgan('combined', { stream }))
  }
}

app.disable('x-powered-by');

app.set('view engine', '.hbs');
app.set('port', PORT);

// static
app.use(express.static(`${__dirname}../../public`));

// api
app.get('/api/vacations', api.getVacationsApi);
app.get('/api/vacation/:sku', api.getVacationBySkuApi);
app.post('/api/vacation/:sku/notify-when-in-season', api.addVacationInSeasonListenerApi);
app.delete('/api/vacation/:sku', api.requestDeleteVacationApi)

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

if (require.main === module) {
  const cert = fs.readFileSync(path.join(__dirname, '../ssl', 'meadowlark.crt'), { encoding: 'utf8' });
  const key = fs.readFileSync(path.join(__dirname, '../ssl', 'meadowlark.pem'), { encoding: 'utf8' });
  https.createServer({ cert, key }, app).listen(app.get('port'), () => {
    console.log(`${app.get('env')} connected on port ${PORT}`);
  });
}
