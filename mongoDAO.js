const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'lecturersDB'
const colName = 'lecturers'

//var lectDB
//var lect
var lectureDB
var lecture

// Connect to the database
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        // Setting up the database in lectureDB
        lectureDB = client.db(dbName)
        // Setting up the collection variable
        lecture = lectureDB.collection(colName)
    })
    .catch((error) => {
        console.log(error)
    })

    
// Add lecturer
var addLecturer = function (id, name, dept) {
    return new Promise((resolve, reject) => {
        lecture.insertOne({ _id: id, name: name, dept: dept })
            .then((docs) => {
                console.log(docs)
                resolve(docs)
            })
            .catch((error) => {
                reject(error)
            })

    })
}


// Get all lecturers 
var showLecturers = function () {
    return new Promise((resolve, reject) => {
        var cursor = lecture.find()
        cursor.toArray()
            .then((docs) => {
                resolve(docs)
            })
            .catch((error) => {
                reject(error)
            })
    })
}




// Export so we can use them / import them in other places
module.exports = { showLecturers, addLecturer }