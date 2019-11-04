const { Router } = require('express');
const router = Router();
const UserI = require('../models/UserI');
const config = require('../config')
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');

router.post('/signup', async (req,res,next)=>{

    const { username, email,password}=req.body;

    /*UserI.create({ //create() metodo para crear un modelo en la base de datos 
        username,
        email,
        password
    });*/
    const user = new UserI({
        username,
        email,
        password
    })

    const userExists = await UserI.findOne({email});
    if(userExists){
        return res.status(401).json({error:"the email already exists"})
    }
    user.password = await user.encryptPassword(user.password);
    await user.save();//guardar en bd el objeto
    
    //guardar el token que retorna el metodo jwt.sign
    const token = jwt.sign({id:user._id},config.secret,{
        expiresIn: 60*60*24 //24 horas en segundos
    })

    res.json({auth:true,token});
})

router.post('/signin',async (req,res,next)=>{
    const { email, password } = req.body;
    const user = await UserI.findOne({email});
    if(!user){
        return res.status(404).json({message:"Invalid login"})
    }
    const validPassword = await user.validatePassword(password);
    if(!validPassword){
        res.status(401).json({error:"Invalid login",auth:false,token:null});
    }

    const token = jwt.sign({id: user._id },config.secret,{
        expiresIn: 60 
    });
    res.json({auth:true, token});

})

router.get('/me', verifyToken, async (req,res,next)=>{
  
   

    const user = await UserI.findById(req.userId,{password:0}); //password:0 para que no muestre la contraseña
    if(!user){
        res.status(404).send('No user found');
    }
    res.json(user);

})

module.exports = router;