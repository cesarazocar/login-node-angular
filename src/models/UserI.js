const { Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username:String,
    email:String,
    password:String
})

//metodo para cifrar contraseña:
userSchema.methods.encryptPassword= async (password)=>{
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password,salt);
};

//metodo para validar si contraseña es correcta

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password,this.password);
}
module.exports = model('User',userSchema); //model sirve para guardar en la base de datos 