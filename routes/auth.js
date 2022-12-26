const router = require('express').Router();
const User = require('../models/User');
const Token = require('../models/Token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');

//Register new user
router.post('/register', async(req, res)=>{

    //Validate req data
    const {error} = registerValidation(req.body); 
    if(error) return  res.status(400).send(error.details[0].message);

    //Check for existing email 
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("Email already exists");

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Create new user 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    //Save new user
    try{const savedUser = await user.save();
        res.send({user: user._id})
    }catch(err){
        res.send(err)
    }

}); 

//Log In an user
router.post('/login', async(req, res)=> {

    //Validate req data
    const {error} = loginValidation(req.body); 
    if(error) return  res.status(400).send(error.details[0].message);

    //Check for existing email 
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Email doesn't exist!");

    //Check password
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send("Password is wrong!");
    // res.send("Logged In!")

    //Create and assign a token
    const accessToken = jwt.sign({_id: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
    const refreshToken =  jwt.sign({_id: user._id}, process.env.REFRESH_TOKEN_SECRET)
    const token = new Token({tokenKey: refreshToken});
    await token.save();
    res.json({'access-token':accessToken,'refresh-token':refreshToken}) //.send(`accessToken: ${accessToken} \nrefreshToken: ${refreshToken}`)
});

//Generate new token     
router.post('/token',async(req, res)=>{
    const user = await User.findOne({email: req.body.email});
    if(user==null) return res.status(400).send("Invalid User")
    const refreshToken = req.header('refresh-token');
    const tokenExists = await Token.findOne({tokenKey: refreshToken});
    if(tokenExists== null) {return res.status(400).send("Invalid Token!")};
    res.json({'access-token':jwt.sign({_id: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})});
    console.log()
});

//Logout User
router.post('/logout', async(req, res)=>{
    const refreshToken = req.header('refresh-token');
    await Token.findOneAndDelete({tokenKey: refreshToken});
    res.send("Logged Out!")

})
module.exports = router;

