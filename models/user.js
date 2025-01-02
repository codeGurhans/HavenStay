const mongoose = require("mongoose");
const passport_local_mongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
});

userSchema.plugin(passport_local_mongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;