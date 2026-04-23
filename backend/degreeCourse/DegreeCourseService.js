const DegreeCourse = require('./DegreeCourseModel')

//show all Course
async function getCourse() {
    try{ 
        const courses = await DegreeCourse.find();
        console.log("Alles Super bei Suchen")
        return courses;
    }catch(err){
        console.log("Fehler bei Suche: " + err)
        throw err;
    }               
}

// suche bestimmt wert
async function getCourseByShortName(uniShortName){
    try{
        const courses = await DegreeCourse.find({universityShortName :uniShortName })
        return courses
    }catch(err){
        console.log("Error fetching courses by University : ",err)
        throw err;
    }
}

//create a  Course
async function createCourse(newData) {
    try{ 
        const newCourse = await DegreeCourse.create(newData);
        console.log("Alles Super bei Insert Course")
        return newCourse;
    }catch(err){
        console.log("Fehler bei Insert Course : " + err)
        throw err;
    }                 
}
//find Course by id
async function findCourseByID(searchCourseID){
    console.log("Course Service: find Course by ID:" + searchCourseID);
    if(!searchCourseID){
        throw new Error("CourseID is missing");
    }
    try{
        var query = await DegreeCourse.findById({_id : searchCourseID});
        if(query){
            console.log(`Found Course ID:`+ searchCourseID);
            return query;
        }else{
            console.log('Could not find Course for Course ID: '+ searchCourseID);
            return null;
        }
    }catch(err){
        console.error('Error finding Course:', err);
        throw err;   
    }
}

//update a course
async function updateCourse(id, updateCourseData) {
    try{ 
        const  updatedCourse = await DegreeCourse.findOneAndUpdate({_id:id}, updateCourseData,{new: true});
        return updatedCourse;
    }catch(err){
        console.log("Fehler bei Update course : " + err)
        throw err;
    }               
}

//delete  course 
async function deleteCourse(courseID) {
    try{ 
         //https://mongoosejs.com/docs/6.x/docs/api/model.html#model_Model-deleteOne
        const course = await DegreeCourse.deleteOne({_id:courseID});
        console.log("Alles Super beim Loeschen")
        return course;
    }catch(err){
        console.log("Fehler bei Delete Course : " + err)
        throw err;
    }              
}

module.exports = {
    getCourse,
    findCourseByID,
    getCourseByShortName,
    createCourse,
    updateCourse,
    deleteCourse
}