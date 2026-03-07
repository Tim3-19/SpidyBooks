        const jwt = require("jsonwebtoken");

        const authenticateToken = (req,res,next)=>{


            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];
            //const token = authHeader ;

            if(token==null)
            {
                return res.status(401).json({message:" Authetication token required"});
            
            }
            //Authentication

            jwt.verify(token,"SecretKey",(err,user)=>{
                if(err)
                {
                    return res.status(403).json({message: "Token expired, Please Sign-in"});
                }
                req.user = user;
                next();
            });
        };

        module.exports = {authenticateToken};