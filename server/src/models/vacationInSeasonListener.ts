import mongoose from 'mongoose';

const vacationInSeasonListenerSchema = new mongoose.Schema({
  email: String,
  skus: [String],
});

export const VacationInSeasonListener = mongoose.model(
  'VacationInSeasonListener',
  vacationInSeasonListenerSchema
);
