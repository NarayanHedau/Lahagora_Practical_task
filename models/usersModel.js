const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

const usersSchema =  new mongoose.Schema(
    {
      username: { type: String, unique: true, required: true },
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      roles: {type:String,required:true},
      roleId: {type: mongoose.Schema.Types.ObjectId, ref: "roleModel"}
      },
      { timestamps: true }
   
);

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;


