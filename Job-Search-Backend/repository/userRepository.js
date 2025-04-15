const { User } = require("../model/user");

class UserRepository {
  CreateUser = async (userObject) =>
    await User.create({
      email: userObject.email,
      name: userObject.name,
      passwordHash: userObject.passwordHash,
    });

  GetUserByEmail = async (email) => await User.findOne({ email });

  GetUserById = async (id) => await User.findById(id);
}

exports.userRepository = new UserRepository();
