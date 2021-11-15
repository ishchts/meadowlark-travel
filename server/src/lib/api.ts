import { Request, Response } from "express";
import { db } from '../db';

export const getVacationsApi = async (req: Request, res: Response) => {
  const vacations = await db.getVacations({ available: true });
  res.json(vacations)
}

export const getVacationBySkuApi = async (req: Request, res: Response) => {
  const vacation = await db.getVacationBySku(req.params.sku)
  res.json(vacation)
}

export const addVacationInSeasonListenerApi = async (req: Request, res: Response) => {
  await db.addVacationInSeasonListener(req.body.email, req.params.sku);
  res.json({ message: 'выполнено успешно' })
}

export const requestDeleteVacationApi = async (req: Request, res: Response) => {
  const { email, notes } = req.body
  res.status(500).json({ message: 'еще не реализовано' })
}