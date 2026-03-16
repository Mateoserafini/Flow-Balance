import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    type: 'income' | 'expense';
    createdAt?: Date;
    updatedAt?: Date;
}       

const categorySchema = new mongoose.Schema<ICategory>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    }
},
    {
        timestamps: true
    }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);