/*stardard Import */
var express = require('express');
var router = express.Router();

/** hole UserService */
var userService = require('./UserService')
/** hole alle Authentication */
const {isAuthenticated, isAdministrator,isAuthorized} = require('../utils/Validation')

//finde all user
router.get('/', isAuthenticated, isAdministrator, async function(req,res){
    try{ 
        console.log("Bin in users route")
        const users = await userService.getUsers(req.body);
        if(users){ 
            console.log("everything allright")
            return res.status(200).json(mappingUser(users)) 
        }else{
            return res.status(500).send("Es gab Probleme beim Abrufen der Benutzer");
        }
    }catch (error){
            console.error("Es gab Probleme beim Abrufen der Benutzer: ", error);
           return res.status(500).send("Es gab Probleme beim Abrufen der Benutzer");
        }
    })

//search User by UserID
router.get('/:userID',isAuthenticated,isAuthorized,async function(req,res){
        try{ 
            console.log("Bin in users route search User by UserID ")
            const userDataID = req.params.userID;
            const users = await userService.findUserByID(userDataID);
            if(!users){
                console.log("UserID is not exist ")
                console.log(`Please enter  a new UserID !!!`);
                return res.status(404).json({ Error: `Es konnte kein User mit der ID ${userDataID}  gefunden werden.` });
            }else{
                return res.status(200).send(subsetUser(users)) 
            }  
        }catch (error){
                console.error("Es gab Probleme beim Abrufen der Benutzer: ", error);
               return res.status(500).send("Es gab Probleme beim Abrufen der Benutzer");
        }
})

//create new user
router.post('/',isAuthenticated,isAdministrator, async function(req,res){
    try{ 
        console.log("Bin in users route für neue Insert user")
        const userID = req.body.userID 
        //check Input UserID  bevor create a new User
        if(!userID){
            return res.status(400).json({ error: `UserID is missing ! Please enter UserID !!!` });
        }else{ 
            //check userID 
            const serachUserID = await userService.findUserByID(userID)
            if(serachUserID){
                console.log("UserID is already exist :  " + userID + "  Please input a new one ")
                console.log(`UserID ${userID} already exists. Please input a new one.`);
                return res.status(400).json({ Error: `UserID ${userID} already exists. Please input a new one.` });
            }else{
                const newUsers = await userService.createUser(req.body);
                console.log("Insert new Data is done")
                return res.status(201).json(subsetUser(newUsers))
            }
        }   
    }catch (error){
        console.error("Es gab Probleme beim  Insert der neuen  Benutzer: ", error);
        return res.status(500).send("Es gab Probleme beim Insert der neuen Benutzer");
    }
})

//Update user 
router.put('/:userID',isAuthenticated,isAuthorized, async function(req,res){
    try{ 
        console.log("Bin in users route für Update user")
        //Variablen deklariert bevor weiter geben
        const userID = req.params.userID;  
        const updateUserData = req.body
        var updateUsers = undefined;
        //check that user as Admin or normal-User
        if(req.isAdmin){
            console.log("The user is an admin");
            updateUsers = await userService.updateUser(userID, updateUserData);
        }else{
            console.log("The user is a normal user");
            if(req.body.isAdministrator !== undefined || req.body.userID !== undefined){ 
                return res.status(403).json({ Error: `You can not change that Attribute: Admin or userID ` })
           }else{ 
               updateUsers = await userService.updateUser(userID, updateUserData);
            }
        }
        if(updateUsers){ 
            console.log("Update Data is allright")
            return res.status(200).json(subsetUser(updateUsers))  
        } else{ 
            return res.status(500).send("Es gab Probleme beim Update der Benutzer");
        }       
    }catch (error){         
        console.error("Es gab Probleme beim  Update der  Benutzer: ", error);
        return res.status(500).send("Es gab Probleme beim Update der Benutzer");    
    }
})

//delete User
router.delete('/:userID',isAuthenticated,isAdministrator, async function(req,res){
    try{ 
        console.log("Bin in users route für Delete user")
        //check userID bevor delete
        const userID = req.params.userID;  
        const serachUserID = await userService.findUserByID(userID)
            if(!serachUserID){
                console.log(`UserID:  ${userID} not exists. Please input a new one.`);
                return res.status(400).json({ Error: `Can not delete that UserID:  ${userID} because it not exists. Please check UserID again.` });
            }else{
                const delUser = await userService.deleteUser(userID);
                console.log("Delete is done")
                return res.status(204).json()    
            }     
    }catch(error){
        console.error("Es gab Probleme beim Delete der Benutzer: ", error);
        return res.status(500).send("Es gab Probleme beim Delete der Benutzer");
    }
})

//function to subset-UserData
function subsetUser(user){
    // subsetCourse bevor send: just selects  specific attrribute 
   const {_id, userID, firstName,lastName,isAdministrator, ...partialObject } = user;
   const subsetUser = { "id":_id, "userID":userID, "firstName":firstName, "lastName":lastName, "isAdministrator":isAdministrator };
   return subsetUser
}

//function to Mapping-UserData with map
function mappingUser(userData){
      const simpliFiedUsers = userData.map(user => {
            return { 
                userID: user.userID,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdministrator: user.isAdministrator
            };
        });
    return simpliFiedUsers
}

module.exports = router; 
