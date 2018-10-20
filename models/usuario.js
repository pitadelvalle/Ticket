var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var SALT_FACTOR = 10;

var usuarioSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    nombre: { type: String },
    apellido_p: { type: String },
    corre: {type:String,required: true},
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String }
});

var donothing = () => {

}

usuarioSchema.pre("save",function(done) {
    var usuario = this;
    if(!usuario.isModified("password")){ 
        return done();
    } 
    bcrypt.genSalt(SALT_FACTOR,(err, salt) => {
        if(err){
            return done(err);
        }
        bcrypt.hash(usuario.password, salt, donothing,
        (err, hashedpassword) => {
            if(err){
                return done(err)
            }
            usuario.password = hashedpassword;
            done();
        });
    });
});

usuarioSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
}

usuarioSchema.methods.name = function() {
    return this.nombre || this.username;
}

usuarioSchema.methods.usrRole = function(){
    return this.role;
}

var Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;