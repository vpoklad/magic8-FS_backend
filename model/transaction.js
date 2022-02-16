import mongoose from 'mongoose';
const { Schema, SchemaTypes, model } = mongoose;

function date() {
  const newDate = new Date();
  const year = Number(newDate.getFullYear());
  const month = Number(newDate.getMonth());
  const day = Number(newDate.getDate());
  return { year, month, day };
}

const transactionSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, 'Set description for transaction'],
    },
    category: {
      type: String,
      required: [true, 'Set category for transaction'],
    },
    categoryLabel: {
      type: String,
      required: [true, 'Set categoryLabel for transaction'],
    },
    sum: {
      type: Number,
      default: 0.0,
      get: v => v.toFixed(2),
      set: v => v.toFixed(2),
      required: [true, 'Set sum of transaction'],
    },
    date: {
      type: String,
      default: Date.now,
      max: Date.now,
    },
    year: { type: Number, default: () => date().year },
    month: { type: Number, default: () => date().month },
    day: { type: Number, default: () => date().day },

    typeOfTransaction: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

const Transaction = model('transaction', transactionSchema);
export default Transaction;
