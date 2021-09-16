import express, { Application } from 'express';
import expressHandlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import multiparty from 'multiparty';
import cookieParser  from 'cookie-parser';
import expressSession from 'express-session';
import nodemailer from 'nodemailer';

import * as handlers from './lib/handlers';

import { credentials } from './config';

const mailTransport = nodemailer.createTransport({
  auth: {
    user: credentials.sendgrid.user,
    pass: credentials.sendgrid.password,
  }
});

async function go() {
  try {
    const result = await mailTransport.sendMail({
      from: '"Meadowlark Travel" <ilya.shutskiy@ifellow.ru>',
      to: 'joecustomer@gmail.com',
      subject: 'Your Meadowlark Travel Tour',
      text: 'Thank you for booking your trip with Meadowlark Travel.  ' +
        'We look forward to your visit!',
    })
    console.log('письмо успешно отправлено: ', result)
  } catch(err: any) {
    console.log('невозможно отправить письмо: ' + err.message)
  }
}

go()

export const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}));

app.disable('x-powered-by');

app.engine('.hbs', expressHandlebars({
  defaultLayout: 'main',
  extname: '.hbs',
}));

app.set('view engine', '.hbs');
app.set('port', PORT);

app.get('/', handlers.home);

app.get('/about', handlers.about);

app.get('/newsletter', handlers.newsletter);

app.post('/api/newsletter-signup', handlers.api.newsletterSignup);

app.get('/contest/vacation-photo', handlers.vacationPhotoContest);

app.get('/contest/vacation-photo-thank-you', handlers.vacationPhotoContestProcessThankYou);

app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
  const form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    handlers.api.vacationPhotoContest(req, res, fields, files);
  });
});

// static
app.use(express.static(`${__dirname}../../public`));

// пользовательская страница 404
app.use(handlers.notFound);

// пользовательская страница 500
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(app.get('port'), () => {
    console.log(`Connected on port ${PORT}`);
  });
}
