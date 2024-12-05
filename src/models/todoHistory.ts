import mongoose, { Document, Schema } from 'mongoose';

export interface ITodoHistory extends Document {
  todoId: Schema.Types.ObjectId;  
  updatedBy: Schema.Types.ObjectId;  
  changes: string; 
  updatedAt: Date;  
}

const TodoHistorySchema: Schema<ITodoHistory> = new mongoose.Schema(
  {
    todoId: {
      type: Schema.Types.ObjectId,
      ref: 'Todo',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changes: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, 
  }
);

export const todoHistoryModel = mongoose.model<ITodoHistory>('TodoHistory', TodoHistorySchema);
