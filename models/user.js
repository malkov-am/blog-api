const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: ({ value }) => `${value} некорректный адрес электронной почты.`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      minlength: [2, 'Поле "Имя" должно быть не короче 2 символов.'],
      maxlength: [30, 'Поле "Имя" должно быть не длинее 30 символов.'],
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError({ message: 'Неправильные email или пароль.' });
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError({ message: 'Неправильные email или пароль.' });
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
