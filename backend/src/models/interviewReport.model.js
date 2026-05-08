import mongoose, { Schema } from "mongoose"

/**
 * job description Schema : String
 * resume text : String
 * self Description : String
 * 
 * matchScore : Number
 *
 * Technical questions :
 * [{
 *   question : "",
 *   intention : "",
 *   answer : ""
 * }]
 *
 * Behavioral questions : [
 * {
 *   question : "",
 *   intention : "",
 *   answer : "",
 * }
 * ]
 *
 * Skill gaps : [{
 *   skill : "",
 *   severity : {
 *     type : String,
 *     enum : ["low", "medium", "high"]
 *   }
 * }]
 * 
 * Prepration Gap : [{
 *      day: Number,
 *      focus : String,
 *      task : [String]
 * }]
 */
const technicalQuestionSchema = new Schema({
    question : {
        type: String,
        required: [ true, 'Technical question is required' ]
    },
    intention : {
        type: String,
        required: [ true, 'Intention is required' ]
    },
    answer : {
        type: String,
        required: [ true, 'Answer is required' ]
    }
},{id: false})
const behavioralQuestionSchema = new Schema({
   question : {
        type: String,
        required: [ true, 'Technical question is required' ]
    },
    intention : {
        type: String,
        required: [ true, 'Intention is required' ]
    },
    answer : {
        type: String,
        required: [ true, 'Answer is required' ]
    }
},{id: false})

const skillGapSchema = new Schema({
    skill : {
        type: String,  
    },
    severity : {
        type : String,
        enum : ["low", "medium", "high"]
    }
},{id: false})
const preparationPlanSchema = new Schema({
    day : {
        type: Number,
        required: [ true, 'Day is required' ]
    },
    focus : {
        type: String,
        required: [ true, 'Focus is required' ]   
    },
    task : [{
        type: String,
        required: [ true, 'Task is required' ]
    }]
})

const interviewReportSchema = new Schema({
    jobDescription: {
        type: String,
        required: [ true, 'Job description is required' ] 
    },
    resume : {
        type: String,
    },
    selfDescription : {
        type: String,
    },
    matchScore : {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions : [technicalQuestionSchema],
    behavioralQuestions : [behavioralQuestionSchema],
    skillGaps : [skillGapSchema],
    preparationPlan : [preparationPlanSchema]
}, { timestamps: true })

const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema)

export default interviewReportModel