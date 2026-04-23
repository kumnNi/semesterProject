const DegreeCourseApplication = require('./DegreeCourseApplicationModel');

//Abrufe alle Application
async function getApp(){
    try{ 
        const appInfo = await DegreeCourseApplication.find();
        console.log("Alles Super bei Suchen")
        return appInfo;
    }catch(err){
        console.log("Fehler bei Suche: " + err)
        throw err;
    }
}

//create a application
async function createApplication(newData) {
    try{ 
        const findApplicationCourse = await DegreeCourseApplication.findOne({
            applicantUserID:newData.applicantUserID,
            degreeCourseID:newData.degreeCourseID,
            targetPeriodYear:newData.targetPeriodYear,
            targetPeriodShortName:newData.targetPeriodShortName });
            if(findApplicationCourse){
                console.log("Your have already that  Application for")
                return false;
            }else{
                const newApplicationCourse = await DegreeCourseApplication.create(newData);
                console.log("Alles Super bei Create a new Application")
                return newApplicationCourse;
            }
    }catch(err){
        console.log("Fehler bei Insert Course : " + err)
        throw err;
    }
                  
}
//find application by UserID
async function getAppByUserID(userID){
    console.log("infor bom Service userID  "+userID)
    const infoAppByUserID = await DegreeCourseApplication.find({applicantUserID:userID})
    console.log("infor bom Service "+JSON.stringify(infoAppByUserID))
    return infoAppByUserID;
}

//finde Application By DegreeCourseID
async function getAppByDegreeCourseID(degreeCourseID){
    const suchAppCourseID = await DegreeCourseApplication.find({degreeCourseID:degreeCourseID})
    return suchAppCourseID;
}

//finde Application By AppicationID
async function getAppByAppID(applicationID){
    const suchAppCourseID = await DegreeCourseApplication.find({_id:applicationID})
    return suchAppCourseID;
}

//update Application
async function getUpdateApplication(applicationID, updateDataInfo){
    const suchAppCourseID = await DegreeCourseApplication.find({_id:applicationID})
    console.log("datatatatat Service...."+JSON.stringify(suchAppCourseID))
    if(suchAppCourseID){
        const newDataUpdateApp = await DegreeCourseApplication.findOneAndUpdate({_id:applicationID},updateDataInfo,{new: true})
        if(newDataUpdateApp){
            return newDataUpdateApp
        }else{
            return false;
        }
    }
}

//delete Application
async function deleteApplication(appID){
    try{ 
       const applicationDel = await DegreeCourseApplication.deleteOne({_id:appID});
       console.log("Alles Super beim Loeschen")
       return applicationDel;
   }catch(err){
       console.log("Fehler bei Delete Application : " + err)
       throw err;
   }
}

module.exports = {
    getApp,
    createApplication,
    getAppByUserID,
    getAppByDegreeCourseID,
    getAppByAppID,
    getUpdateApplication,
    deleteApplication
}