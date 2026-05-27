import { model, Schema } from 'mongoose';
import { TCertification } from './certification.interface';

const certificationSchema = new Schema<TCertification>(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String },
    expiryDate: { type: String },
    credentialUrl: { type: String },
    badgeImage: { type: String },
    certificateFile: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

certificationSchema.index({ order: 1 });

export const Certification = model<TCertification>('Certification', certificationSchema);
