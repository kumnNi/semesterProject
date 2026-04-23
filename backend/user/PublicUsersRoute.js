/*stardard Import */
var express = require('express');
var router = express.Router();

/** hole UserService */
var userService = require('./UserService')
    
//finde all user
router.get('/',async function(req,res, next){
    try{ 
        console.log("Bin in users route")
        const users = await userService.getUsers(req.body);
        console.log("everything allright")
        return res.status(200).send(Object.values(users));
    }catch (error){
        console.error("Es gab Probleme beim Abrufen der Benutzer: ", error);
        return res.status(500).send("Es gab Probleme beim Abrufen der Benutzer");
    
    }
})

//search User by UserID
router.get('/:userID',async function(req,res, next){
        try{ 
            console.log("Bin in users route search User by UserID ")
            const userID = req.params.userID;
            const users = await userService.findUserByID(userID);
            //check users bevor return
            if(!users){
                console.log("UserID is not exist ")
                console.log(`Please enter  a new UserID !!!`);
                return res.status(404).json({ Error: `Es konnte kein User mit der ID ${userID}  gefunden werden.` });
            
            }else{
                console.log("everything allright")
                return res.status(200).json(users)
            }   
        }catch (error){
            console.error("Es gab Probleme beim Abrufen der Benutzer: ", error);
            return res.status(500).send("Es gab Probleme beim Abrufen der Benutzer");
        
        }
})

//create new user
router.post('/', async function(req,res, next){
        try{ 
            console.log("Bin in users route für neue Insert user")
            const userID = req.body.userID 
            //check UserID  bevor create a new User
            if(!userID){
                console.log("UserID is missing ")
                console.log(`Please enter UserID !!!`);
                return res.status(400).json({ error: `UserID is missing ! Please enter UserID !!!` });
            } else{
                const serachUserID = await userService.findUserByID(userID)
                //check UserID if already exist then can not create
                if(serachUserID){
                    console.log("UserID is already exist :  " + userID + "  Please input a new one ")
                    console.log(`UserID ${userID} already exists. Please input a new one.`);
                    return res.status(400).json({ Error: `UserID ${userID} already exists. Please input a new one.` });
                }else{
                    const newUsers = await userService.createUser(req.body);
                    console.log("Result: " + newUsers)
                    console.log("Insert new Data is done")
                    return res.status(201).json(newUsers)   
                }
            }  
        }catch (error){
            console.error("Es gab Probleme beim  Insert der neuen  Benutzer: ", error);
            return res.status(500).send("Es gab Probleme beim Insert der neuen Benutzer");
            }
})

//Update user
router.put('/:userID', async function(req,res){
    try{ 
        console.log("Bin in users route für Update user")
        const userID = req.params.userID;  
        const updateUserData = req.body
        const updatedUsers = await userService.updateUser(userID, updateUserData);
        if(!updatedUsers){
            return res.status(500).send("Es gab Probleme beim Update der neuen Benutzer");
        }else{
            console.log("Update Data is allright")
            return  res.status(200).json(updatedUsers) 
        }            
    }catch (error){         
        console.error("Es gab Probleme beim  Update der neuen  Benutzer: ", error);
        return res.status(500).send("Es gab Probleme beim Update der neuen Benutzer");    
    }
})

//delete User
router.delete('/:userID', async function(req,res, next){
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

module.exports = router; 
