import { Request, Response, ErrorRequestHandler } from 'express';
import getFortune from './fortune';

export const home = (req: Request, res: Response) => res.render('home');

export const about = (req: Request, res: Response) => res.render('about', { fortune: getFortune() });

export const notFound = (req: Request, res: Response) => res.render('not-found');

/* eslint-disable no-unused-vars */
export const serverError: ErrorRequestHandler = (err, req, res, next) => res.render('error');
