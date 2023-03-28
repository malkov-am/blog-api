const mongoose = require('mongoose');
const validator = require('validator');

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Не передано поле "content".'],
    },
    filename: {
      type: String,
    },
    filelink: {
      type: String,
      validate: {
        validator(link) {
          return validator.isURL(link);
        },
        message: ({ value }) => `${value} некорректный URL вложения.`,
      },
    },
    owner: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Не передано поле "Автор".'],
      ref: 'user',
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('post', postSchema);
