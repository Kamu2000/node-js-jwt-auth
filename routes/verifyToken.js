const jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    const accessToken = req.header('access-token');
    if (!accessToken) return  res.status(400).send("Access Denied!")
    try{
        const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET )
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send("Invalid Token!")
    }
}