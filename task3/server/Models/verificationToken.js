const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const verificationTokenSchema = new mongoose.Schema({
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  token : {
    type: String,
    required:true
  },
  CreatedAt: {
    type: Date,
    expires: 600,
    default: Date.now()
  }
});

verificationTokenSchema.pre("save", async function (next) {
  if(this.isModified("token")){
    const hash = await bcrypt.hash(this.token,8)
    this.token = hash
  }

  next()
});

verificationTokenSchema.methods.compareToken = async function(token) {
    const result = await bcrypt.compare(token,this.token)

    return result
}

module.exports = mongoose.model("verificationToken", verificationTokenSchema);