import express, { Application } from 'express';
import expressHandlebars from 'express-handlebars';

import * as handlers from './lib/handlers';

export const app: Application = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

app.engine('handlebars', expressHandlebars());

app.set('view engine', 'handlebars');
app.set('port', PORT);

app.get('/', handlers.home);

app.get('/about', handlers.about);

// static
app.use(express.static(__dirname + '../../public'));

// пользовательская страница 404
app.use(handlers.notFound);

// пользовательская страница 500
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(app.get('port'), () => {
    console.log(`Connected on port ${PORT}`);
  });
}
