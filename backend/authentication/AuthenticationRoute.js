var express = require('express');
var router = express.Router();
const base64 = require('base-64')
var logger = require('../../config/winston')
var authenticationService = require('./AuthenticationService')

router.get('/', async function(req, res, next){
    console.log("want to create token")
    //check that Anfrage  Authentification
    //https://roadmap.sh/guides/http-basic-authentication
    const authHeader = req.headers.authorization;
    req.header.au
    console.log("autheHeader ",+ authHeader)
    if (!authHeader || !authHeader.indexOf('Basic')=== -1) {
        return res.set('WWW-Authenticate','Basic realm="Secure Area"').status(401).send('Authentication required.')
    }
    const encodeCredentials = authHeader.trim().replace(/Basic\s+/i,'')
    const decodeBase64Credentials = base64.decode(encodeCredentials);
    const [userID, password] = decodeBase64Credentials.split(':')
       // convert to json
       const contoJson = {
        userID,
        password
       }
    //create Session Token
    try{
        const { token, user, err } = await authenticationService.createSessionToken(contoJson)
        if(token){
            res.header("Authorization","Bearer " + token);
            if(user){ 
                const {id, userID, firstName, lastName,isAdministrator, ...partialObject } = user;
                const subset = { id, userID, firstName,lastName, isAdministrator };
               return res.send(subset)   
            }else{
                console.log("User is null, even though a token has been created. Error: " + err);
               return res.send('Could create token')
            }
        }else{
            console.log("Token has not been created, Error: " + err)
           return res.send("Could not created token");
        }
    }
    catch(err){
        console.error("Error in login route: ", err);
       return res.status(401).send({ Error: `Failed to create token: Authentication failed` });
    }
})

// mit login-path
router.post('/login', async function(req, res, next){
    console.log("want to create token")
    //check that Anfrage  Authentification
    //https://roadmap.sh/guides/http-basic-authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.indexOf('Basic')=== -1) {
        return res.set('WWW-Authenticate','Basic reaml"user_pages"').status(401).send('Authentication required.')
    }
    const encodeCredentials = authHeader.trim().replace(/Basic\s+/i,'')
    const decodeBase64Credentials = base64.decode(encodeCredentials);
    const [userID, password] = decodeBase64Credentials.split(':')
    
       // convert to json
       const contoJson = {
        userID,
        password
       }
    //create Session Token
    try{
        const { token, user, err } = await authenticationService.createSessionToken(contoJson)
        if(token){
            res.header("Authorization","Bearer " + token);
            if(user){ 
                const {id, userID, firstName, lastName,isAdministrator, ...partialObject } = user;
                const subset = { id, userID, firstName,lastName, isAdministrator };
                console.log(JSON.stringify(subset))
                res.status(200).json({Success:'Token created sussessfully'.JSON.stringify(subset) })
            }
            else{
                console.log("User is null, even though a token has been created. Error: " + err);
                res.send('Could create token')
            }
        }else{
            console.log("Token has not been created, Error: " + err)
            res.send("Could not created token");
        }
    }
    catch(err){
        logger.error("Error in login route: ", err);
        res.status(500).send("Internal Server Error");
    }
}) 
module.exports = router;