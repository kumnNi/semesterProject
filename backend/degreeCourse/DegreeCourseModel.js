var mongoose = require('mongoose');

//create Schema von DegreeCourse
const DegreeCourseSchema = new mongoose.Schema({
    name: String,
    shortName: String,
    universityName: String,
    universityShortName: String,
    departmentName: String,
    departmentShortName: String,
},{timestamps: true});

const DegreeCourse = mongoose.model("DegreeCourse", DegreeCourseSchema);

module.exports =  DegreeCourse ;