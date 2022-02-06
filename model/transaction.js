import mongoose from 'mongoose';
const { Schema, SchemaTypes, model } = mongoose;

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
      type: String,
      required: [true, 'Set sum of transaction'],
    },
    date: {
      type: String,

      // до вияснення..
    },
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
