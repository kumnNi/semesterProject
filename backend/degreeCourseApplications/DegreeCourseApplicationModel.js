var mongoose = require('mongoose');

//create Schema von DegreeCourseApplication
const DegreeCourseApplicationSchema = new mongoose.Schema({
    applicantUserID: String,
    degreeCourseID: String,
    targetPeriodYear: String,
    targetPeriodShortName: String,
    
},{timestamps: true});

const DegreeCourseApplication = mongoose.model("DegreeCourseApplication", DegreeCourseApplicationSchema);

module.exports =  DegreeCourseApplication ;