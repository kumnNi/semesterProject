var express = require('express');
var router = express.Router();
const {isAuthenticated, isAdministrator} = require('../utils/Validation')
/** hole Service */
var applicationService = require('./DegreeCourseApplicationService');

//abruf alle Application vom Admin
router.get('/',isAuthenticated,isAdministrator, async function(req, res){
    try{
        const suchAppByUserName = req.query.applicantUserID
        const suchAppByDegreeCourse = req.query.degreeCourseID
        var reqApplication = undefined
        if(suchAppByUserName){
            reqApplication = await applicationService.getAppByUserID(suchAppByUserName);
        }else if(suchAppByDegreeCourse){
            reqApplication = await applicationService.getAppByDegreeCourseID(suchAppByDegreeCourse);

        }else{
            reqApplication = await applicationService.getApp(req.body);
        }
           if(!reqApplication){
            return res.status(500).send("Es gab Probleme beim Abrufen der Application");
           }else{
                const simpliFiedApplication = reqApplication.map(appUser => {
                    return {
                        id: appUser.id, 
                        applicatUserID: appUser.applicantUserID,
                        degreeCourseID: appUser.degreeCourseID,
                        periodYear: appUser.targetPeriodYear,
                        periodShortName: appUser.targetPeriodShortName
                        
                        };
                    });
                return res.status(200).json(simpliFiedApplication)
            }
    }catch(error){
     return  res.status(500).send("Es gab Probleme beim Abrufen der Application");
    }
})

//Abruf Application vom user,seine eigene Information
router.get('/myApplications',isAuthenticated, async function(req, res){
    try{
           const userID = req.userID.user
           const reqApplication = await applicationService.getAppByUserID(userID);
           if(reqApplication){
                const simpliFiedApplication = reqApplication.map(appUser => {
                    return {
                        id: appUser.id, 
                        applicatUserID: appUser.applicantUserID,
                        degreeCourseID: appUser.degreeCourseID,
                        periodYear: appUser.targetPeriodYear,
                        periodShortName: appUser.targetPeriodShortName
                        
                        };
                    });
              return res.status(200).send(simpliFiedApplication)
           }else{
                return res.send(400).json(reqApplication)
           }  
    }catch(error){
       return res.status(500).send("Es gab Probleme beim Abrufen der Application");
    }
})

//create Application
router.post('/',isAuthenticated, async function(req, res){
    try{
        const userID = req.userID.user
        const insertNewData = req.body
        var reqApplication = undefined
        const degreeCourseCheckt = req.body.degreeCourseID
        //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
        let checkForValidMongoDbID = new RegExp("^[0-9a-fA-F]{24}$");
        if(checkForValidMongoDbID.test(degreeCourseCheckt)){
            if(userID === 'admin'){
                reqApplication = await applicationService.createApplication(req.body); 
            }else{ 
                if(req.body.applicantUserID === undefined && userID === req.userID.user){
                   insertNewData.applicantUserID = userID
                    reqApplication = await applicationService.createApplication(req.body);
                }else{
                    return res.status(403).send({Error: 'You are not allowed to apply the application for anyone else '})
                } 
            }
                
            if(reqApplication){
               return res.status(200).send(subsetApplication(reqApplication))
            }else{ 
              return res.status(400).send({Error: 'Your have already that  Application '})
            }
        }else {
           return res.status(400).send({Error: ' DegreeCourseID is falsch '})
        }     
    }catch(error){
       return res.status(400).send("Es gab Probleme beim Anlegen der neuer Application");
    }
})

//update by ApplicationID
router.put('/:_id',isAuthenticated,isAdministrator, async function(req, res, next){
        try{
            const reqAppID = req.params._id
            const dataToUpdate = req.body
            const updateAppByAppID = await applicationService.getUpdateApplication(reqAppID, dataToUpdate)
            if(updateAppByAppID){
                res.status(200).json(subsetApplication(updateAppByAppID))
            }else{
                res.status(400).send("something wrong");
            }   
        }catch(err){
            res.status(400).send("Es gab Probleme beim Update der Application");
        }
})

//dele Application
router.delete('/:_id',isAuthenticated,isAdministrator, async function( req, res, next){
    try{ 
        console.log("Bin in users route für Delete App")
        //check userID bevor delete
        const applicationID = req.params._id;  
        const serachID = await applicationService.getApp(applicationID)
            if(!serachID){
                console.log(`Application ID:  ${serachID} not exists. Please input a new one.`);
                return res.status(400).json({ Error: `Can not delete this Application ID:  ${serachID} because it not exists. Please check Appication ID again.` });
            }
        const delApplication = await applicationService.deleteApplication(applicationID);
        console.log("Result: " + delApplication)
        res.status(204).json()
        console.log("Delete  Application is done") 
    }catch (error){
            console.error("Es gab Probleme beim Delete der Application: ", error);
            res.status(500).send("Es gab Probleme beim Delete der Application");
    }
})

//function to subsetObject-Application
function subsetApplication(appInfo){
    // subsetApplication bevor send: just selects  specific attrribute 
    const {id, applicantUserID, degreeCourseID,targetPeriodYear,targetPeriodShortName, ...partialObject } = appInfo;
    const subsetApplication = { id, applicantUserID, degreeCourseID,targetPeriodYear,targetPeriodShortName };
   return subsetApplication
}

module.exports = router; 