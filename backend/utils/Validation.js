const config = require("config");
const jwt = require("jsonwebtoken"); 
const userService = require('../user/UserService')

//check Authenticated
function isAuthenticated(req, res, next){
    if(typeof req.headers.authorization !== "undefined"){
        let token = req.headers.authorization.split(' ')[1]
        var privateKey = config.get('session.tokenKey');
        jwt.verify(token,  privateKey, { algorithm: "HS256"}, async (err, user) =>{
            try{ 
                if(err){
                    return res.status(401).json({Error:"Not Authorized 1"}); 
                }
                if(user){
                    req.userID = user
                    next()
                }else{
                    return res.status(401).json({Error:"Not Authorized"});
                }
            }catch(err){
                console.error("Authentication error:", err);
                return res.status(500).json({ Error: "Internal Server Error" });
            }
        })
    }else{
        res.status(401).json({Error: "Not Authorized"})
        return;
    }
}

//check that Administrator
async function isAdministrator (req,res, next){
    //https://stackoverflow.com/questions/54578203/creating-a-middleware-function-to-check-if-user-role-is-equal-to-admin
    //https://www.tabnine.com/code/javascript/functions/is_admin
        try { 
            let token = req.headers.authorization.split(' ')[1]
            var privateKey = config.get('session.tokenKey');
            userInfo = jwt.verify(token,  privateKey, { algorithm: "HS256"})
            const getIDUser = userInfo.user
            const findeAdmin = await userService.findUserByID(getIDUser)
                if(!findeAdmin || !findeAdmin.isAdministrator){
                   return res.status(401).send({Error:"not Authorized"});
                }else{
                    return next()
                }
        }catch(err){
            return res.status(401).send({Error:"not Authorized"});
        }  
}

//check user that Authorized
async function isAuthorized(req,res, next){
    try { 
        //https://stackoverflow.com/questions/24000580/how-does-req-headers-authorization-get-set
        const authHeader = req.headers.authorization
        const tokenAuthen = Buffer.from((authHeader.split(" ")[1]).split('.')[1],'base64')
        const payload = JSON.parse(tokenAuthen);
        const dataUserToken = payload.user
        const reqUserId = req.params.userID
        //check that userID vom req ,that the same UserToken(userLogin) and UserToken(userLogin) is admin
        if(reqUserId !== dataUserToken && dataUserToken === 'admin'){
           req.isAdmin = dataUserToken === 'admin';
           next()
        }else if(reqUserId === dataUserToken){ //if reqHeader-UserToken is same as UserToken
            req.isUser = dataUserToken === reqUserId 
            next()
        }else{
            return res.status(401).send({Error:"not Authorized. It does not your userID !!!! "});
        }
    }catch(err){
       return res.status(401).send({Error:"not Authorized "});
    }
}

module.exports = {
    isAuthenticated,
    isAdministrator,
    isAuthorized
 }