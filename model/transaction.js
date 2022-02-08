import pkg from 'joi';
const { number } = pkg;
import mongoose from 'mongoose';
const { Schema, SchemaTypes, model } = mongoose;

function date() {
  const newDate = new Date();
  const year = String(newDate.getFullYear());
  // const month = String(newDate.getMonth());
  const month = Math.round(Math.random() * 11);
  const seconds = String(newDate.getSeconds());

  return { year, month, seconds };
}

const transactionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for transaction'], // по мекету "Описание"
    },
    category: {
      type: String,
      required: [true, 'Set category for transaction'],
    },
    sum: {
      // type: String,v.toFixed(2)
      type: Number,
      // default: 0.0,
      get: v => parseFloat(v).toFixed(2),
      set: v => parseFloat(v).toFixed(2),
      //alias: 'sumF',
      required: [true, 'Set sum of transaction'],
    },
    date: {
      type: String,
      default: Date.now,
      max: Date.now,

      // до вияснення..
    },
    // date: { type: Date, transform: v => v.getFullYear() },
    year: { type: String, default: () => date().year },
    month: { type: String, default: () => date().month },
    seconds: { type: String, default: () => date().seconds },
    // year: { type: String, default: '2022' },
    // month: { type: String, default: '7' },
    // day: { type: String, default: '07' },
    typeOfTransaction: {
      type: Boolean,
      default: false, // видатки - false, доходи - true
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
