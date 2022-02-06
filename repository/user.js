import User from "../model/user";

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findByVerifyToken = async (verificationToken) => {
  return await User.findOne({ verificationToken });
};

const createNewUser = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

const updateVerification = async (id, status) => {
  return await User.updateOne(
    { _id: id },
    { isVerify: status, verificationToken: null }
  );
};

export default {
  findById,
  findByEmail,
  createNewUser,
  updateToken,
  updateAvatar,
  findByVerifyToken,
  updateVerification,
};
