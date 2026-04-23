/* stardard Import */
var express = require('express');
var router = express.Router();

/** hole CourseService */
var coursesService = require('./DegreeCourseService')
var applicationService = require('../degreeCourseApplications/DegreeCourseApplicationService');
//import Authen, und Admin vom datei: Validation
const {isAuthenticated, isAdministrator} = require('../utils/Validation')

// alle Course abrufen
router.get('/',async function(req,res, next){
    try{ 
        console.log("Bin in Course route")
        const uniShortName = req.query.universityShortName
        var courses = undefined
        if(uniShortName){
            courses = await coursesService.getCourseByShortName(uniShortName);
        }else{ 
            courses = await coursesService.getCourse(req.body);
        }
        if(courses){
        // Extract specific properties (id, firstName, lastName) from each user
        const simpliFiedCourse = courses.map(course => {
            return {
                id: course.id, 
                name: course.name,
                shortName: course.shortName,
                universityName: course.universityName,
                universityShortName: course.universityShortName,
                departmentName: course.departmentName,
                departmentShortName: course.departmentShortName
            };
        });
            console.log("everything allright")
           return res.status(200).json(simpliFiedCourse) 
        }else{
            return res.status(500).send("Es gab Probleme beim Abrufen der Course");
        }
    }catch (error){
            console.error("Es gab Probleme beim Abrufen der Course: ", error);
           return res.status(500).send("Es gab Probleme beim Abrufen der Course");
        }
})

//create new course
router.post('/',isAuthenticated,isAdministrator, async function(req,res, next){
        try{ 
            console.log("Bin in course route für neue insert course")
            const newCourse = await coursesService.createCourse(req.body);
            if(newCourse){
                const {id, name, shortName, universityName,universityShortName,departmentName,departmentShortName, ...partialObject } = newCourse;
                const subsetCourse = { id, name, shortName,universityName, universityShortName,departmentName,departmentShortName };  
                console.log("Insert new Course is done") 
                return res.status(201).send(subsetCourse)
            }else{
                return res.status(500).send("Es gab Probleme beim Insert der neuen Course");
            }
        }catch (error){
            console.error("Es gab Probleme beim  Insert der neuen  Course: ", error);
            return res.status(500).send("Es gab Probleme beim Insert der neuen Course");
        }
})

//search Course by ID after create
router.get('/:_id',isAuthenticated,isAdministrator,async function(req,res, next){
    try{ 
            console.log("Bin in Degree route search Course by ID ") 
            const degreeCourseID  = req.params._id;
            const course = await coursesService.findCourseByID(degreeCourseID);
            if(!course){
                console.log("Course ID is not exist ")
                console.log(`Please enter  a new Course ID !!!`);
                return res.status(404).json({ Error: `Es konnte kein Course mit der ID ${degreeCourseID}  gefunden werden.` });
            }else{
                console.log("Course has found ")
                return res.status(200).json(subsetDegreeCourse(course))
            }
    }catch (error){
            console.error("Es gab Probleme beim Abrufen der Course: ", error);
           return res.status(500).send("Es gab Probleme beim Abrufen der Course");
        }
})

//search special Case:  Course by ID and then with ApplicationID
router.get('/:_id/:degreeCourseApplications',isAuthenticated,isAdministrator,async function(req,res, next){
    try{ 
            console.log("Bin in Degree route search Course by ID ")
            const degreeCourseID  = req.params._id;
            const course = await coursesService.findCourseByID(degreeCourseID);
                if(!course){
                    console.log("Course ID is not exist ")
                    console.log(`Please enter  a new Course ID !!!`);
                    return res.status(404).json({ Error: `Es konnte kein Course mit der ID ${degreeCourseID}  gefunden werden.` });
                }else{
                     //https://stackoverflow.com/questions/65030377/expressjs-call-another-route-in-different-route
                    const appInfomation =  await applicationService.getAppByDegreeCourseID(degreeCourseID)
                    if(appInfomation){
                        console.log("Course in Application has found ")
                        return res.status(200).json(mappingDegreeCourseApp(appInfomation))
                    }else{
                        return res.status(500).send("Es gab Probleme beim Abrufen der Course");
                    }
                }
    }catch (error){
            console.error("Es gab Probleme beim Abrufen der Course: ", error);
            return res.status(500).send("Es gab Probleme beim Abrufen der Course");
        }
})

//update course
router.put('/:id',isAuthenticated,isAdministrator, async function(req, res, next){
        try{ 
            console.log("Bin in update course route für update course")
            const courseID = req.params.id;  
            const updateCourseData = req.body     
            const updatedCourse = await coursesService.updateCourse(courseID,updateCourseData);
            if(updatedCourse){
                console.log("Update Course is done")
                return res.status(200).json(subsetDegreeCourse(updatedCourse))
            }else{
                return res.status(500).send("Es gab Probleme beim Update der Course");
            }
        }catch (error){
                console.error("Es gab Probleme beim  Update der  Course: ", error);
                return res.status(500).send("Es gab Probleme beim Update der Course");
            }
})

// delete Course
router.delete('/:_id',isAuthenticated,isAdministrator, async function( req, res, next){
    try{ 
        console.log("Bin in users route für Delete Course")
        //definierte courseID bevor delete
        const courseID = req.params._id;  
        const serachID = await coursesService.findCourseByID(courseID)
            if(!serachID){
                console.log(`Course ID:  ${serachID} not exists. Please input a new one.`);
                return res.status(400).json({ Error: `Can not delete that CourseID:  ${serachID} because it not exists. Please check CourseID again.` });
            }
        const delCourse = await coursesService.deleteCourse(courseID);
        return res.status(204).json()
    }catch (error){
            console.error("Es gab Probleme beim Delete der Course: ", error);
           return res.status(500).send("Es gab Probleme beim Delete der Course");
        }
})

//function to subset Course-Data
function subsetDegreeCourse(degreeCourseInfo){
    // subsetCourse bevor send: just selects  specific attrribute 
    const {id, name, shortName, universityName,universityShortName,departmentName,departmentShortName, ...partialObject } = degreeCourseInfo;
    const subsetappInfomation = { id, name, shortName,universityName, universityShortName,departmentName,departmentShortName };
    return subsetappInfomation
}
//function to mapping Application-Data for special Case
function mappingDegreeCourseApp(degreeCourseData){
    const mappedCourse = degreeCourseData.map(applications =>{
        return {
            id: applications.id, 
            applicantUserID: applications.applicantUserID,
            degreeCourseID: applications.degreeCourseID,
            targetPeriodYear: applications.targetPeriodYear,
            targetPeriodShortName: applications.targetPeriodShortName
        };
    });
    return mappedCourse;
}

module.exports = router; 