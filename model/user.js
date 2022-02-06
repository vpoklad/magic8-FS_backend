import mongooseService from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const { Schema, model } = mongooseService;

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Guest',
    },
    email: {
      type: String,
      required: [true, 'Set email for user!'],
      unique: true,
      validate(value) {
        const symbols = /\S+@\S+\.\S+/;
        return symbols.test(String(value).trim().toLowerCase());
      },
    },
    password: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0.0,
    },
    token: {
      type: String,
      default: null,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: randomUUID,
      required: [true, 'Verify token is required!'],
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
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);
export default User;
