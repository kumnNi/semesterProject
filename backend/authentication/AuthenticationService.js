var userService  = require('../user/UserService')
var jwt = require("jsonwebtoken"); 
var config = require("config");
var logger = require('../../config/winston')

async function createSessionToken(props){
    logger.debug("AuthenticationService: create Token");
    //check JSON da oder nicht
    if(!props){
        logger.error("Error: have no json body");
        callback("JSON-Body missing", null, null);
        return null
    }
        try{ 
            const user = await  userService.findUserByID(props.userID)
            console.log("User:::::: "+user)
            if(user){
                logger.debug("Found user, check the password");
                const isMatch = await user.comparePassword(props.password)
                console.log("propspassword:::::: "+props.password)
                if(isMatch){
                        logger.debug('Password is correct, Create token');

                        //create token
                        var issuedAt = new Date().getTime();
                        var expirationTime = config.session.timeout;
                        var expiresAt = issuedAt + (expirationTime * 1000);
                        var privateKey = config.get('session.tokenKey');
                        let token = jwt.sign({"user": user.userID}, privateKey, {
                            expiresIn:expiresAt, 
                            algorithm: 'HS256'});

                        console.log('Token created: '+ token);
                        return {token, user }
                }else{
                    logger.error("Password is invalid");
                    throw new Error("Invalid password")
                }
            }else{
                    console.log("Session Service: Did not find user for user ID: "+ props.userID);
                    throw new Error("User not found");
            }
        }catch(error){
                console.log("Error in authenticateUser", error)
                throw error;
        }        
}

module.exports = {
    createSessionToken   
}