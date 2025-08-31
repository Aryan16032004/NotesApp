import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  userId: string;
  content: string;
  createdAt: Date;
}

const NoteSchema = new Schema<INote>({
  userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INote>('Note', NoteSchema);
