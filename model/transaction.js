import mongoose from 'mongoose';
const { Schema, SchemaTypes, model } = mongoose;

function date() {
  const newDate = new Date();
  const year = Number(newDate.getFullYear());
  // const month = Number(newDate.getMonth());
  const month = Math.round(Math.random() * 11);
  const day = Number(newDate.getDay());

  return { year, month, day };
}

const transactionSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, 'Set description for transaction'], // по мекету "Описание"
    },
    category: {
      type: String,
      required: [true, 'Set category for transaction'],
    },
    categoryLabel: {
      type: String,
      uppercase: true,
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
      // до вияснення..
    },
    year: { type: Number, default: () => date().year },
    month: { type: Number, default: () => date().month },
    day: { type: Number, default: () => date().day },
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
