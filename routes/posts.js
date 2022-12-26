const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req,res)=>{
    res.json({posts:{
        title:"First post",
        description:"Private data"
        }
    });
});

module.exports = router;