import mongoose, { Schema, Document, Model } from 'mongoose';

interface Facility extends Document {
  name: string;
  description: string;
  availability: boolean;
  location: string;
  openingHours: string;
  capacity: number;
  equipment: string[];
}

const facilitiesSchema = new Schema<Facility>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      required: true,
    },
    openingHours: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    equipment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'equipments',
      },
    ],
  },
  { timestamps: true }
);

const Facility: Model<Facility> = mongoose.model<Facility>(
  'Facilities',
  facilitiesSchema
);
export default Facility;
