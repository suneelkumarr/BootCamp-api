const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        require:[true, "please add a name"]
    },
    email:{
        type: String,
        require:[true, "please add a Email"],
        unique: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please use valid email"
          ]
    },

    role:{
        type:String,
        enum:["user", "publisher"],
        default:"user"
    },
    password:{
        type:String,
        require:[true, "please add a password"],
        minlength:6,
        // select:false
    },

    resetPasswordToken:String,
    resetPasswordExpiration:Date,
    createdAt:{
        type:Date,
        default:Date.now()
    },
})


// UserSchema.pre("save", async function(next){
//     if(!this.isModified("password")){
//         next();
//     } 
//     const salt = await bcrypt.genSalt(10);
//     console.log(this.password)
//     this.password =await bcrypt.hash(this.password, salt);
//     next();
// })

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

// Sign JWT
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  };

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // Set expire
    this.resetPasswordExpiration = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
  



module.exports = mongoose.model("User", UserSchema);