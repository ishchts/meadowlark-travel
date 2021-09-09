import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import expressHandlebars from 'express-handlebars';
import path from "path";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', expressHandlebars());

app.set('view engine', 'handlebars');
app.set('port', PORT);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  const fortunes = [
    "Победи свои страхи, или они победят тебя.",
    "Рекам нужны истоки.",
    "Не бойся неведомого.",
    "Тебя ждет приятный сюрприз.",
    "Будь проще везде, где только можно.",
  ];
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

  res.render('about',  { fortune: randomFortune });
});

// static
app.use(express.static(__dirname + '../../public'));

// пользовательская страница 404
app.use((req, res) => {
  res.status(404);
  res.render('not-found');
});

// пользовательская страница 500
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  err.status(500);
  res.render('error');
};

app.use(errorHandler);

app.listen(app.get('port'), () => {
  console.log(`Connected on port ${PORT}`);
});