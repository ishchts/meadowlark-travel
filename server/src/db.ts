import mongoose from "mongoose";
import {credentials} from "./config";
import { Vacation } from "./models/vacation";
import { VacationInSeasonListener } from './models/vacationInSeasonListener';
import { User } from './models/user';

mongoose.connect(credentials.mongo.connectionString)
  .then((res) => {
    console.log('Установлено соединение с MongoDB')
  })
  .catch((err) => {
      console.log('Ошибка MongoDB:', err.text)
  })

export const db = {
  //user
  getUserById: async (id: string) => User.findById(id),
  getUserByAuthId: async (authId: string) => User.findOne({ authId }),
  addUser: async (data: Record<string, string | Date>) => new User(data).save(),
  // end user
  getVacations: async (options?: { available: boolean }) => (
    Vacation.find(options || {})
  ),
  getVacationBySku: async (sku: string) => Vacation.findOne({ sku }),
  addVacationInSeasonListener: async (email: string, sku: string) => {
    await VacationInSeasonListener.updateOne(
      { email },
      { $push: { skus: sku } },
      { upsert: true }
    )
  }
}