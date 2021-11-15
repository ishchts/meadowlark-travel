import { Request, Response, ErrorRequestHandler } from 'express';
import getFortune from './fortune';

export const home = (req: Request, res: Response) => {
  res.cookie('monster', 'ням-ням');
  res.cookie('signed_monster', 'ням-ням', { signed: true });
  res.render('home')
};

export const about = (req: Request, res: Response) => {
  console.log('req.cookies.monster', req.cookies.monster);
  console.log('req.signedCookies.signed_monster',  req.signedCookies.signed_monster);
  res.render('about', { fortune: getFortune() })
};

export const notFound = (req: Request, res: Response) => res.render('not-found');

/* eslint-disable no-unused-vars */
export const serverError: ErrorRequestHandler = (err, req, res, next) => res.render('error');

export const newsletter = (req: Request, res: Response) => {
  res.render('newsletter', { csrf: 'Здесь находится токен CSRF' })
}

export const api = {
  newsletterSignup: (req: Request, res: Response) => {
    console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf)
    console.log('Имя (из видимого поля формы): ' + req.body.name)
    console.log('Email (из видимого поля формы): ' + req.body.email)
    res.send({ result: 'success' })
  },
  vacationPhotoContest: (req: Request, res: Response, fields: any, files: any) => {
    console.log('данные поля: ', fields);
    console.log('файлы: ', files);
    res.status(200).send({ result: 'success' });
  }
};

export const vacationPhotoContest = (req: Request, res: Response) => {
  const now = new Date();
  res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth() });
};

export const vacationPhotoContestProcessThankYou = (req: Request, res: Response) => {
  res.render('contest/vacation-photo-thank-you')
}
