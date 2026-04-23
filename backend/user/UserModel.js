var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//create Schema von User
const UserSchema = new mongoose.Schema({
    id: Number,
    userID: {type: String, unique: true, Request:true},
    firstName: String,
    lastName: String,
    password: String, 
    isAdministrator: {type: Boolean, default:false},
},{timestamps: true});

UserSchema.methods.whoAmI = function(){
    var output = this.userID 
        ? "My name is" + this.userName
        : "I don't have a name";
    console.log(output);
}

UserSchema.pre('save', function(next){
    var user = this;

    console.log("Pre-save: " + this.password + "change: "+ this.isModified('password'));
    if(!user.isModified('password')){ 
       return next()
    };
    bcrypt.hash(user.password, 10).then((hashedPassword)=>{
        user.password = hashedPassword;
        next();
    })
}, function (err){
    next(err);
})
//https://stackoverflow.com/questions/67085134/mongoose-schema-async-method-doesnt-wait
UserSchema.methods.comparePassword = function(candidatePassword){
    return new Promise((resolve, reject)=>{
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
            if(err)
                reject(err);
            else
                resolve( isMatch)
        });
    });  
}

const User = mongoose.model("User", UserSchema);

module.exports = User ;