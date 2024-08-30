import mongoose, { Schema, Document, Model } from 'mongoose';

interface Equipment extends Document {
  name: string;
  type: string;
  brand: string;
  purchaseDate: Date;
  condition: 'NEW' | 'GOOD' | 'FAIR' | 'POOR';
  location: string;
  maintenanceSchedule: Date[];
  isAvailable: boolean;
}

const equipmentSchema = new Schema<Equipment>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    condition: {
      type: String,
      enum: ['NEW', 'GOOD', 'FAIR', 'POOR'],
      default: 'GOOD',
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    maintenanceSchedule: [
      {
        type: Date,
        required: true,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Equipment: Model<Equipment> = mongoose.model<Equipment>(
  'Equipment',
  equipmentSchema
);
export default Equipment;
