const mongoose = require('mongoose');

const authorInviteSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model('AuthorInvite', authorInviteSchema);
